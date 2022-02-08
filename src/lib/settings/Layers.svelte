<script>
    import { lyr, lyrCSS, mapTheme, mapTitle, scaleDist, isModalOpen, modalContent } from '../../stores.js'
    import { slide } from "svelte/transition"
    import { select } from 'd3-selection'
    import Tip from '../UI/Tip.svelte'
    import Styling from './Styling.svelte'
    import Toggle from '../UI/Toggle.svelte'
    import Badge from '../UI/Badge.svelte'
    import GraticuleFilter from './GraticuleFilter.svelte'
    // import UrbanFilter from './UrbanFilter.svelte'
    import CitiesFilter from './CitiesFilter.svelte'
    import ReliefFilter from './ReliefFilter.svelte'
    import layersList from '../../assets/layersList.js'
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'
    import tooltip from '../../assets/tooltip.js'
    import { isLyr } from '../../assets/isLyr.js'
    
    export let canRender

    let isScaleBar, isMapTitle
    $: {
        $lyr
        isScaleBar = isLyr('scaleBar')
        isMapTitle = isLyr('mapTitle')
    }

    //Tips message
    let m1 = "Ajouter ou retirer des informations et en modifier la représentation graphique."

    function addLayer(layer) {
        const base = select("#gBasemap")
        // Couches hidden par défault
        base.selectChildren().filter(':not(#outline)').style("visibility", "hidden").classed("hidden", true)

        // Pour chaque bouton radio sélectionné => rendre visible le layer
        layer.forEach(e => select(`#gBasemap #${e}`).style("visibility", "visible").classed("hidden", false))
        // Cas particuliers (titre et échelle)
        isScaleBar
            ? select("#gScaleBar").style("visibility", "visible").classed("hidden", false)
            : select("#gScaleBar").style("visibility", "hidden").classed("hidden", true)
        isMapTitle
            ? select("#mapTitle").style("visibility", "visible").classed("hidden", false)
            : select("#mapTitle").style("visibility", "hidden").classed("hidden", true)
    }

    $: addLayer($lyr)
</script>

{#if canRender}
<section id="layers" class="settings-section"
    use:inView 
    on:enter={() => stepEnter("headerLayers")}
>
    <h2><span class="material-icons">layers</span> Personnaliser</h2>
    <Tip message={m1} />

    <!-- Prevent implicit submission of the form = ne recharge pas la page si 'form > input' + Enter -->
    <!-- <input type="submit" disabled style="display: none" aria-hidden="true" /> -->

    <h3>Thèmes graphiques</h3>
    <div id="themes">
        <Badge onClick={() => $mapTheme = 'colorMode'}
            classActive={$mapTheme === 'colorMode'}
            text="Couleurs"
            isTooltip={false} />

        <Badge onClick={() => $mapTheme = 'outlineMode'}
            classActive={$mapTheme === 'outlineMode'}
            text="Noir et blanc"
            isTooltip={false} />
    </div>

    <h3>Géographie physique</h3>
    <ul>
        {#each layersList.filter(d => d.type == "geo") as {id, name, type, styleType} }
            <li>
                <Toggle label={name} {id} {name} value={id} bind:bindGroup={$lyr} />
                <Styling layer={id} {styleType} disabled={$lyr.includes(id) ? false : true}>
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
        {#each layersList.filter(d => d.type == "human") as {id, name, type, styleType} }
            <li>
                <Toggle label={name} {id} {name} value={id} bind:bindGroup={$lyr} />
                <Styling layer={id} {styleType} disabled={$lyr.includes(id) ? false : true}>
                    {#if id == 'cities'}
                    <CitiesFilter />
                    {/if}
                    <!-- {#if id == 'urban'}
                    <UrbanFilter />
                    {/if} -->
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
            {#if isScaleBar}
            <div class="habillage-style" transition:slide={{ duration: 300 }}>
                <input type="text" bind:value={$scaleDist} placeholder="distance en km">
                <p>Cliquer sur l'échelle pour la déplacer</p>
            </div>
            {/if}
        </li>
        <li>
            <Toggle label="Titre" id="title" name="Titre" value="mapTitle" bind:bindGroup={$lyr} />
            {#if isMapTitle}
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

    p { margin-bottom: 0; }
</style>