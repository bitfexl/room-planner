export interface GeomentryNode {
    toPolygon(): Polygon;
}

/**
 * A point in space.
 * 0,0 (x,y) is the top left corner, x=horizontal, y=vertical
 * toPolygon just returns the point, not quite correct.
 */
export class Point implements GeomentryNode {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Add two points (x+x, y+y), returns a new point.
     */
    add(other: Point) {
        return new Point(this.x + other.x, this.y + other.y);
    }

    distanceTo(other: Point) {
        return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
    }

    toPolygon(): Polygon {
        // not quite correct but works
        return new Polygon([this]);
    }
}

/**
 * Two connected points in space.
 * toPolygon just returns the two points, not quite correct.
 */
export class Line implements GeomentryNode {
    a: Point;
    b: Point;

    constructor(a: Point, b: Point) {
        this.a = a;
        this.b = b;
    }

    toPolygon(): Polygon {
        // not quite correct but works
        return new Polygon([this.a, this.b]);
    }
}

/**
 * A circle defined by its center and radius.
 * The number of sides for toPolygon approximation can be set.
 */
export class Circle implements GeomentryNode {
    center: Point;
    radius: number;

    /**
     * The number of sides for polygon apporximation,
     * must be a minimum of 3 (triangle).
     */
    sides: number;

    constructor(center: Point, radius: number, sides: number = 48) {
        this.center = center;
        this.radius = radius;
        this.sides = sides;
    }

    toPolygon(): Polygon {
        const step = (2 * Math.PI) / this.sides;
        let points: Point[] = [];

        for (let i = 0; i < this.sides; i++) {
            let offset = new Point(Math.sin(step * i) * this.radius, Math.cos(step * i) * this.radius);
            points.push(this.center.add(offset));
        }

        return new Polygon(points);
    }
}

/**
 * A rectangle defined by the two opposite corners.
 */
export class Rectangle implements GeomentryNode {
    a: Point;
    b: Point;

    constructor(a: Point, b: Point) {
        this.a = a;
        this.b = b;
    }

    toPolygon(): Polygon {
        return new Polygon([this.a, new Point(this.b.x, this.a.y), this.b, new Point(this.a.x, this.b.y)]);
    }
}

/**
 * A list of points connected to each other.
 * Last poit is connected to first.
 */
export class Polygon implements GeomentryNode {
    points: Point[];

    constructor(points: Point[]) {
        this.points = points;
    }

    toPolygon(): Polygon {
        return this;
    }
}
