<script>
    import { select } from 'd3-selection'
    import { slide } from 'svelte/transition'
    import rgb2hex from '../../assets/rgb2hex.js'

    // Stratégie d'accordéon en svelte
    // https://www.youtube.com/watch?v=vs10Omo9H7c
    // https://svelte.dev/repl/0aff293b94e44574a83a8271ba457136?version=3.29.4
    // https://svelte.dev/repl/74ff0da7cb074d4788b996e2d91258d3?version=3.23.0

    export let lyr, style, disabled

    let isOpen = false
    const toggle = () => isOpen = !isOpen
    let fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWidth

    // select("#basemap").append('rect').attr('id', "test").attr('x', 50).attr('y', 50).attr('width', 100).attr('height', 100)

    // 1. charger les inputs des styles de la carte
    // !! test simplifié => https://svelte.dev/repl/7314dfbb07634362b2e7910ad409de9c?version=3.44.0
    // ATTENTION aux unités => width en 'px' (= parseFloat) et color en hexadecimal (= rgb3hex voir mon notebook utils observable)
    
    $: fillColor     = rgb2hex( select(`g#basemap #${lyr}`).style("fill") )
    $: fillOpacity   = select(`g#basemap #${lyr}`).style("fill-opacity")
    $: strokeColor   = rgb2hex( select(`g#basemap #${lyr}`).style("stroke") )
    $: strokeOpacity = select(`g#basemap #${lyr}`).style("stroke-opacity")
    $: strokeWidth   = parseFloat( select(`g#basemap #${lyr}`).style("stroke-width") )
    $: {
        select(`g#basemap #${lyr}`)
            .style("fill", fillColor)
            .style("fill-opacity", fillOpacity)
            .style("stroke", strokeColor)
            .style("stroke-opacity", strokeOpacity)
            .style("stroke-width", `${strokeWidth}px`)
    }

    // 2. le faire une fois à l'ouverture de la boite de stylage
    // 3. lier les valeurs des inputs au style de la carte
    function addStyling(lyr, value) {
        const base = select("g#basemap")
        // Couches hidden par défault
        base.selectChildren().style("visibility", "hidden").classed("hidden", true) 
        // Pour chaque bouton radio sélectionné => rendre visible le layer
        lyr.forEach(e => select("g#basemap").select(`#${e}`).style("visibility", "visible").classed("hidden", false))
    }

</script>

<button type="button" aria-expanded={isOpen} on:click={toggle} {disabled}>
    {#if isOpen}
    <!-- PICTO OUVERT -->
    <span class="material-icons">settings</span>
    {:else}
    <!-- PICTO FERMÉ -->
    <span class="material-icons">settings</span>
    {/if}
</button>

{#if isOpen}
<section class="panel" transition:slide={{ duration: 300 }}>
    {#if style.includes("fill")}
    <form class="form-style">
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
    {/if}

    {#if style.includes("stroke")}
    <form class="form-style">
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
                <input type="range" bind:value={strokeWidth} id="strokeWidth" min="0.1" max="2" step="0.1" >
                <input type="number" bind:value={strokeWidth} id="strokeWidth" min="0.1" max="2" step="0.1" >
            </li>
        </ul>
    </form>
    {/if}
</section>
{/if}

<style>
    section {
        padding: 1rem;
        background-color: var(--grey);
    }

    button {
        background-color: transparent;
        border: 0;
        color: var(--dark-grey);
    }
    button:hover, button:hover[aria-expanded="true"] { color: var(--accent-color); }
    button[aria-expanded="true"] { color: var(--accent-color-light);}
    button:disabled { color: var(--grey); }
    
    .form-style:first-of-type {
        margin-bottom: 1rem;
    }
    .form-style h3 {
        font-size: var(--text-small);
        margin: 0;
    }
    .form-style ul {
        list-style-type: none;
        padding: 0;
    }
    .form-style li {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
    }
    .form-style label {
        /* Taille du label */
        flex: 1;
        font-size: var(--text-small);
    }
    .form-style input {
        /* Taille de l'input par rapport au label (1x, 2x...) */
        /* flex: 1; */
    }
</style>