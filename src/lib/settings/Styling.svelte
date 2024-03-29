<script>
    import { select } from 'd3-selection'
    import { slide } from 'svelte/transition'
    import { rgb2hex } from '../js/rgb2hex.js'
    import { zTransform, mapTheme, lyr, lyrCSS } from '../../stores.js'
    import { isLyr } from '../js/isLyr.js'

    // Stratégie d'accordéon en svelte
    // https://www.youtube.com/watch?v=vs10Omo9H7c
    // https://svelte.dev/repl/0aff293b94e44574a83a8271ba457136?version=3.29.4
    // https://svelte.dev/repl/74ff0da7cb074d4788b996e2d91258d3?version=3.23.0

    export let layer, styleType, disabled

    let isLayer
    $: { isLayer = isLyr(layer) ; $lyr }

    let isOpen = false
    const toggle = () => isOpen = !isOpen

    // !! test simplifié => https://svelte.dev/repl/7314dfbb07634362b2e7910ad409de9c?version=3.44.0
    // ATTENTION aux unités => width en 'px' (= parseFloat) et color en hexadecimal (= rgb2hex voir mon notebook utils sur Observable)

    // Stock les styles courants de chaque couche...
    // ... dans une variable locale
    let mapStyle = $lyrCSS[layer] || {}

    // ... dans le store + sessionStorage -> { ocean: mapStyle, countries: mapStyle, ...}
    $: $lyrCSS[layer] = mapStyle

    // 1. Load avec style storage

    const getMapStyle = (lyr) => {
        let fillColor       = !mapStyle.fillColor      ? rgb2hex( select(`#gBasemap #${lyr}`).style("fill") )              : mapStyle.fillColor
        const fillOpacity   = !mapStyle.fillOpacity    ? select(`#gBasemap #${lyr}`).style("fill-opacity")                 : mapStyle.fillOpacity
        const strokeColor   = !mapStyle.strokeColor    ? rgb2hex( select(`#gBasemap #${layer}`).style("stroke") )          : mapStyle.strokeColor
        const strokeOpacity = !mapStyle.strokeOpacity  ? select(`#gBasemap #${layer}`).style("stroke-opacity")             : mapStyle.strokeOpacity
        const strokeWidth   = !mapStyle.strokeWidth    ? parseFloat( select(`#gBasemap #${layer}`).style("stroke-width") ) : mapStyle.strokeWidth
        return mapStyle = {fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWidth}
    }

    
    let currentTheme = $mapTheme

    // À chaque changement de thème
    $: if(currentTheme != $mapTheme) {
        // Reset des styles inlines
        select(`#gBasemap #${layer}`)
            .style("fill", null)
            .style("fill-opacity", null)
            .style("stroke", null)
            .style("stroke-opacity", null)
            .style("stroke-width", null)

        // reset variable
        mapStyle = {} 

        // Styles par variables CSS deviennent prioritaires
        // Stock styles du nouveau thème  ('computed styles' = variables CSS)
        getMapStyle(layer)
        currentTheme = $mapTheme // update current theme
    }

    $: getMapStyle(layer)

    // Applique sur chaque couche les changements de style provenant d'inputs
    $: {
        select(`#gBasemap #${layer}`)
            .style("fill", layer == 'hydro' ? mapStyle.strokeColor : mapStyle.fillColor)
            .style("fill-opacity", layer == 'hydro' ? mapStyle.strokeOpacity : mapStyle.fillOpacity)
            .style("stroke", mapStyle.strokeColor)
            .style("stroke-opacity", mapStyle.strokeOpacity)
            .style("stroke-width", `${mapStyle.strokeWidth / $zTransform.k}px`) // compense le facteur de zoom
    }

</script>

<button type="button" aria-expanded={isOpen} title="Modifier le style" on:click={toggle} {disabled}>
    <span class="material-icons">edit</span>
</button>

<slot></slot>

{#if isOpen && isLayer}
<section class="panel" transition:slide={{ duration: 300 }}>
    {#if styleType.includes("fill")}
        <h3 class='fill'>Fond</h3>
        <ul>
            <li>
                <label for="fillColor">Couleur</label>
                <input type="color" bind:value={mapStyle.fillColor} id="fillColor" >
            </li>
            <li>
                <label for="fillOpacity">Transparence</label>
                <input type="range" bind:value={mapStyle.fillOpacity} id="fillOpacity" min="0" max="1" step="0.1" >
                <input type="number" bind:value={mapStyle.fillOpacity} id="fillOpacity" min="0" max="1" step="0.1" >
            </li>
        </ul>
    {/if}

    {#if styleType.includes("stroke")}
        <h3 class='stroke'>Contour</h3>
        <ul>
            <li>
                <label for="strokeColor">Couleur</label>
                <input type="color" bind:value={mapStyle.strokeColor} id="strokeColor" >
            </li>
            <li>
                <label for="strokeOpacity">Transparence</label>
                <input type="range" bind:value={mapStyle.strokeOpacity} id="strokeOpacity" min="0" max="1" step="0.1" >
                <input type="number" bind:value={mapStyle.strokeOpacity} id="strokeOpacity" min="0" max="1" step="0.1" >
            </li>
            <li>
                <label for="strokeWidth">Épaisseur</label>
                <input type="range" bind:value={mapStyle.strokeWidth} id="strokeWidth" min="0" max="2" step="0.1" >
                <input type="number" bind:value={mapStyle.strokeWidth} id="strokeWidth" min="0" max="2" step="0.1" >
            </li>
        </ul>
    {/if}
</section>
{/if}

<style>
    section {
        background-color: var(--grey);
        width: 100%;
        padding: .5rem 1rem;
        margin-bottom: .5rem;
        border-left: 2px solid var(--dark-grey);
    }

    button {
        background-color: transparent;
        border: 0;
        color: var(--dark-grey);
    }
    button:hover, button:hover[aria-expanded="true"] { color: var(--accent-color); }
    button[aria-expanded="true"] { color: var(--accent-color-medium);}
    button:disabled { color: var(--grey); }

    h3 {
        font-size: var(--text-small);
        margin: 0;
    }
    h3.fill ~ h3.stroke { margin-top: 1rem; }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        gap: 1ch;
    }
    label {
        /* Taille du label */
        flex: 1;
        font-size: var(--text-small);
    }
    input[type="range"] { width: 5rem; }
    input[type="number"] { width: 2rem; font-size: var(--text-small);}
    input[type="color"] { width: 2.5rem; }
</style>