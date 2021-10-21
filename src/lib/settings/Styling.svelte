<script>
    import { slide } from 'svelte/transition'
    // Stratégie d'accordéon en svelte
    // https://www.youtube.com/watch?v=vs10Omo9H7c
    // https://svelte.dev/repl/0aff293b94e44574a83a8271ba457136?version=3.29.4
    // https://svelte.dev/repl/74ff0da7cb074d4788b996e2d91258d3?version=3.23.0

    // export let id, style
    let isOpen = false
    const toggle = () => isOpen = !isOpen
    let fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWidth

</script>

<button aria-expanded={isOpen} class="accordion" on:click={toggle}>
    {#if isOpen}
    <!-- PICTO OUVERT -->
    <span class="icon">&minus;</span>
    {:else}
    <!-- PICTO FERMÉ -->
    <span class="icon">&plus;</span>
    {/if}
</button>

{#if isOpen}
<section class:open-panel={isOpen} class="panel" transition:slide={{ duration: 1000 }}>
    <form id="form-styling">
        <h3>Fond</h3>
        <ul>
            <li>
                <label for="fillColor">Couleur</label>
                <input type="color" bind:value={fillColor} id="fillColor" >
            </li>
            <li>
                <label for="fillOpacity">Transparence</label>
                <input type="range" bind:value={fillOpacity} id="fillOpacity" min="0" max="1" step="0.1" >
                <input type="number" bind:value={fillOpacity} id="fillOpacity" min="0" max="1" step="0.1" >
            </li>
        </ul>
    </form>
    <form id="form-styling">
        <h3>Contour</h3>
        <ul>
            <li>
                <label for="strokeColor">Couleur</label>
                <input type="color" bind:value={strokeColor} id="strokeColor" >
            </li>
            <li>
                <label for="strokeOpacity">Transparence</label>
                <input type="range" bind:value={strokeOpacity} id="strokeOpacity" min="0" max="1" step="0.1" >
                <input type="number" bind:value={strokeOpacity} id="strokeOpacity" min="0" max="1" step="0.1" >
            </li>
            <li>
                <label for="strokeWidth">Épaisseur</label>
                <input type="range" bind:value={strokeWidth} id="strokeWidth" min="0.1" max="10" step="0.1" >
                <input type="number" bind:value={strokeWidth} id="strokeWidth" min="0.1" max="10" step="0.1" >
            </li>
        </ul>
    </form>
</section>
{/if}

<style>
</style>