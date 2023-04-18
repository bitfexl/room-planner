<script context="module" lang="ts">
    export enum Tool {
        Line,
        Circle,
        Rectangle,
        Square,
        // Polygon,
    }
</script>

<script lang="ts">
    import { Circle, Point, type GeomentryNode, Rectangle } from "./geomentry";

    const MOUSE_BTN_PRIMARY = 0;
    const MOUSE_BTN_SECONDARY = 2;

    export let width;
    export let height;

    export let nodes: GeomentryNode[] = [];

    export let activeTool: Tool | null = null;

    nodes.push(new Circle(new Point(200, 200), 180));
    nodes.push(new Rectangle(new Point(100, 200), new Point(200, 300)));

    let canvas: HTMLCanvasElement;

    $: {
        canvas;
        if (canvas != null) {
            repaintCanvas(canvas.getContext("2d"));
        }
    }

    let startingPoint: Point | null = null;
    let hoveringPoint: Point | null = null;

    function handleMouse(e: MouseEvent) {
        if (activeTool === null) {
            return;
        }

        const x = e.offsetX;
        const y = e.offsetY;

        if (e.type == "mousedown") {
            if (startingPoint === null && e.button == MOUSE_BTN_PRIMARY) {
                startingPoint = new Point(x, y);
            }

            if (e.button === MOUSE_BTN_SECONDARY) {
                let shape = getShape(startingPoint, hoveringPoint);
                if (shape != null) {
                    nodes.push(shape);
                }

                startingPoint = null;
                hoveringPoint = null;
            }
        } else if (e.type == "mouseup") {
        } else if (e.type == "mousemove") {
            hoveringPoint = new Point(x, y);
        } else if (e.type == "mouseleave") {
            startingPoint = null; // todo: do not reset?
            hoveringPoint = null;
        }

        repaintCanvas(canvas.getContext("2d"));
    }

    function getShape(startingPoint: Point, hoveringPoint: Point) {
        if (activeTool == Tool.Circle) {
            return new Circle(startingPoint, startingPoint.distanceTo(hoveringPoint));
        } else if (activeTool == Tool.Rectangle) {
            return new Rectangle(startingPoint, hoveringPoint);
        } else if (activeTool == Tool.Square) {
            // todo: extract (interface?)
            let s = Math.max(Math.abs(hoveringPoint.x - startingPoint.x), Math.abs(hoveringPoint.y - startingPoint.y));
            return new Rectangle(
                startingPoint,
                startingPoint.add(
                    new Point(s * Math.sign(hoveringPoint.x - startingPoint.x), s * Math.sign(hoveringPoint.y - startingPoint.y))
                )
            );
        }

        return null;
    }

    function repaintCanvas(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = "red";

        for (let node of nodes) {
            renderNode(ctx, node);
        }

        paintDrawingShape(ctx);
    }

    function paintDrawingShape(ctx: CanvasRenderingContext2D) {
        if (activeTool === null || startingPoint === null || hoveringPoint === null) {
            return;
        }

        let shape = getShape(startingPoint, hoveringPoint);
        if (shape != null) {
            renderNode(ctx, shape);
        }

        let oldStyle = ctx.strokeStyle;
        ctx.strokeStyle = "blue";

        // paint drawing helpers
        ctx.beginPath();

        if (activeTool == Tool.Circle || activeTool == Tool.Rectangle) {
            ctx.moveTo(startingPoint.x, startingPoint.y);
            ctx.lineTo(hoveringPoint.x, hoveringPoint.y);
        } else if (activeTool == Tool.Square) {
            // todo: extract
            let s = Math.max(Math.abs(hoveringPoint.x - startingPoint.x), Math.abs(hoveringPoint.y - startingPoint.y));
            ctx.moveTo(startingPoint.x, startingPoint.y);
            ctx.lineTo(
                startingPoint.x + s * Math.sign(hoveringPoint.x - startingPoint.x),
                startingPoint.y + s * Math.sign(hoveringPoint.y - startingPoint.y)
            );
        }

        ctx.stroke();

        ctx.strokeStyle = oldStyle;
    }

    function renderNode(ctx: CanvasRenderingContext2D, node: GeomentryNode) {
        const polygon = node.toPolygon();

        ctx.beginPath();
        let first = true;

        for (let point of polygon.points) {
            if (first) {
                ctx.moveTo(point.x, point.y);
                first = false;
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }

        ctx.closePath();
        ctx.stroke();
    }
</script>

<canvas
    bind:this={canvas}
    {width}
    {height}
    on:mousedown={handleMouse}
    on:mouseup={handleMouse}
    on:mousemove={handleMouse}
    on:mouseleave={handleMouse}
    on:contextmenu|preventDefault
/>

<style>
    canvas {
        border: 1px solid red;
    }
</style>
