<script lang="ts">
    import DrawLayer, { Tool } from "./lib/DrawLayer.svelte";

    let tool: Tool | null = null;
</script>

<main>
    <DrawLayer width={800} height={600} activeTool={tool} />
    <br />
    <b>Tool: </b>
    <button on:click={() => (tool = null)}>None</button>
    <button on:click={() => (tool = Tool.Circle)}>Circle</button>
    <button on:click={() => (tool = Tool.Rectangle)}>Rectangle</button>
    <button on:click={() => (tool = Tool.Square)}>Square</button>
</main>

<style>
</style>
