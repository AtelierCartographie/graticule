<script>
    import { onMount } from 'svelte'
    import { lyr, mapTheme, mapTitle, scaleDist, canAddScale, isModalOpen, modalContent } from '../../stores.js'
    import { slide } from "svelte/transition"
    import { select } from 'd3-selection'
    import Tip from './Tip.svelte'
    import Styling from './Styling.svelte'
    import Toggle from './Toggle.svelte'
    import GraticuleFilter from './GraticuleFilter.svelte'
    import UrbanFilter from './UrbanFilter.svelte'
    import ReliefFilter from './ReliefFilter.svelte'
    import layers_list from '../../assets/layers_list.js'
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'
    import tooltip from '../../assets/tooltip.js'
    

    export let canRender

    // Ajouter l'échelle graphique
    $: if ($lyr.includes("scaleBar")) {
        let checked = document.getElementById('input_scale').checked
        if (checked) { canAddScale.set(checked) }
    }

    //Tips message
    let m1 = "Ajouter si besoin des informations supplémentaires"

    function addLayer(layer) {
        const base = select("#gBasemap")
        // Couches hidden par défault
        base.selectChildren().style("visibility", "hidden").classed("hidden", true)

        // Pour chaque bouton radio sélectionné => rendre visible le layer
        layer.forEach(e => select(`#gBasemap #${e}`).style("visibility", "visible").classed("hidden", false))
        // Cas particuliers (titre et échelle)
        layer.includes("scaleBar") 
            ? select("#gScaleBar").style("visibility", "visible").classed("hidden", false)
            : select("#gScaleBar").style("visibility", "hidden").classed("hidden", true)
        layer.includes("mapTitle")
            ? select("#mapTitle").style("visibility", "visible").classed("hidden", false)
            : select("#mapTitle").style("visibility", "hidden").classed("hidden", true)
    }

    $: addLayer($lyr)
    
    onMount( () => {
        // applique la couche par défaut au démarrage
        addLayer($lyr)
    })
</script>

{#if canRender}
<section id="layers" class="settings-section"
    use:inView 
    on:enter={() => stepEnter("headerLayers")}
>
    <h2><span class="material-icons">layers</span> Personnaliser</h2>
    <!-- <Tip message={m1} /> -->

    <!-- Prevent implicit submission of the form = ne recharge pas la page si 'form > input' + Enter -->
    <!-- <input type="submit" disabled style="display: none" aria-hidden="true" /> -->

    <h3>Thèmes</h3>
    <div id="themes">
        <button on:click={() => mapTheme.set('colorMode')}
                class:active="{ $mapTheme === 'colorMode' }"
                type="button" 
                class="badge">
            Couleurs
        </button>
        <button on:click={() => mapTheme.set('outlineMode')}
                class:active="{ $mapTheme === 'outlineMode' }"
                type="button" 
                class="badge">
            Noir et blanc
        </button>
    </div>

    <h3>Géographie physique</h3>
    <ul>
        {#each layers_list.filter(d => d.type == "geo") as {id, name, type, style} }
            <li>
                <Toggle label={name} {id} {name} value={id} bind:bindGroup={$lyr} />
                <Styling layer={id} {style} disabled={$lyr.includes(id) ? false : true}>
                    {#if id == 'relief'}
                    <ReliefFilter />
                    {:else if id == 'graticule'}
                    <GraticuleFilter />
                    {/if}
                </Styling>
            </li>
        {/each}
    </ul>

    <h3>Géographie humaine</h3>
    <ul>
        {#each layers_list.filter(d => d.type == "human") as {id, name, type, style} }
            <li>
                <Toggle label={name} {id} {name} value={id} bind:bindGroup={$lyr} />
                <Styling layer={id} {style} disabled={$lyr.includes(id) ? false : true}>
                    {#if id == 'urban'}
                    <UrbanFilter />
                    {/if}
                </Styling>
            </li>
        {/each}
    </ul>

    <h3>Habillage</h3>
    <ul>
        <li>
            <Toggle label="Échelle" id="scale" name="Échelle" value="scaleBar" bind:bindGroup={$lyr} />
            <span 
                use:tooltip title="Cliquer pour en savoir plus"
                on:click={() => modalContent.set('scale')}
                on:click={isModalOpen.set(!$isModalOpen)}
                class="material-icons tooltip">help_outline</span>
            {#if $lyr.includes("scaleBar")}
            <div class="habillage-style" transition:slide={{ duration: 300 }}>
                <input type="text" bind:value={$scaleDist} placeholder="distance en km">
                <p>Cliquer sur l'échelle pour la déplacer</p>
            </div>
            {/if}
        </li>
        <li>
            <Toggle label="Titre" id="title" name="Titre" value="mapTitle" bind:bindGroup={$lyr} />
            {#if $lyr.includes("mapTitle")}
            <div class="habillage-style" transition:slide={{ duration: 300 }}>
                <input type="text" bind:value={$mapTitle} style="width: 90%;">
            </div>
            {/if}
        </li>
    </ul>
</section>
{/if}

<style>
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-flow: column nowrap;
        gap: .2rem;
    }
    li {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-items: center;
        gap: .5rem;
    }
    :global(.Toggle__label) {
        /* Taille du label */
        /* flex: 1; */
        width: 9rem;
        font-size: var(--text-medium);
    }
    :global(.habillage-style) {
        background-color: var(--grey);
        width: 100%;
        padding: .5rem 1rem;
        margin-bottom: .5rem;
        border-left: 2px solid var(--dark-grey);
        font-size: var(--text-small);
    }
    input[type="text"] { font-size: var(--text-small); }

    #themes {
        display: flex;
        gap: .5rem;
    }
    .badge {
        display: inline-block;
        /* min-zwidth: 1em; */
        padding: .3rem .7rem;
        border-radius: 2em;
        font-size: var(--text-small);
        text-align: center;
        background: var(--light-grey);
        color: var(--dark-grey);
        border: 1px solid var(--dark-grey);
    }
    .badge.active, .badge:hover {
        background: var(--accent-color-light);
        color: var(--accent-color);
        border: 1px solid var(--accent-color);
    }

    p { margin-bottom: 0; }
</style>