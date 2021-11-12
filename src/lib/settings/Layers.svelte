<script>
    import { onMount } from 'svelte'
    import { lyr, mapTitle, scaleDist, canAddScale } from '../../stores.js'
    import { slide } from "svelte/transition";
    import { select } from 'd3-selection'
    import Tip from './Tip.svelte'
    import Styling from './Styling.svelte'
    import Toggle from './Toggle.svelte'
    import layers_list from '../../assets/layers_list.js'
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'
    

    export let canRender

    // Couches actives
    let lyr_selected = ['ocean', 'land', 'borders']
    $: lyr.set(lyr_selected)
    
    // Titre de la carte
    let map_title = "Titre de la carte"
    $: mapTitle.set(map_title)

    // Ajouter l'échelle graphique
    $: if (lyr_selected.includes("scaleBar")) {
        let checked = document.getElementById('scale').checked
        if (checked) { canAddScale.set(checked) }
    }
    // Taille de l'échelle graphique
    let scale_dist
    $: scaleDist.set(scale_dist)

    //Tips message
    let m1 = "Ajouter si besoin des informations supplémentaires"

    function addLayer(lyr) {
        const base = select("g#basemap")
        // Couches hidden par défault
        base.selectChildren().style("visibility", "hidden").classed("hidden", true) 
        // Pour chaque bouton radio sélectionné => rendre visible le layer
        lyr.forEach(e => select("g#basemap").select(`#${e}`).style("visibility", "visible").classed("hidden", false))
        // Cas particuliers
        lyr.includes("scaleBar") ? select("g#scaleBar").style("visibility", "visible") : select("g#scaleBar").style("visibility", "hidden")
        lyr.includes("mapTitle") ? select("#mapTitle").style("visibility", "visible") : select("#mapTitle").style("visibility", "hidden")
    }

    $: addLayer(lyr_selected)
    
    onMount( () => {
        // applique la couche par défaut au démarrage
        addLayer(lyr_selected)
    })
</script>

{#if canRender}
<section id="layers" class="settings-section"
    use:inView 
    on:enter={() => stepEnter("headerLayers")}
>
    <h2><span class="material-icons">layers</span> Alimenter</h2>
    <Tip message={m1} />

    <form id="layers-select">
        <h3>Informations géographiques</h3>
        <ul>
            {#each layers_list as {id, name, style} }
                <li>
                    <Toggle label={name} {id} {name} value={id} bind:bindGroup={lyr_selected} />
                    <Styling lyr={id} {style} disabled={lyr_selected.includes(id) ? false : true} />
                </li>
            {/each} 
        </ul>
    </form>
    

    <hr>
    <form id="habillage">
        <!-- Prevent implicit submission of the form = ne recharge pas la page si input mapTitle + Enter -->
        <input type="submit" disabled style="display: none" aria-hidden="true" />
        <h3>Habillage</h3>
        <ul>
                <li>
                    <Toggle label="Échelle" id="scale" name="Échelle" value="scaleBar" bind:bindGroup={lyr_selected} />
                    {#if lyr_selected.includes("scaleBar")}
                    <div class="habillage-style" transition:slide={{ duration: 300 }}>
                        <input type="text" bind:value={scale_dist} placeholder="distance en km">
                    </div>
                    {/if}
                </li>
                <li>
                    <Toggle label="Titre" id="title" name="Titre" value="mapTitle" bind:bindGroup={lyr_selected} />
                    {#if lyr_selected.includes("mapTitle")}
                    <div class="habillage-style" transition:slide={{ duration: 300 }}>
                        <input type="text" bind:value={map_title} style="width: 90%;">
                    </div>
                    {/if}
                </li>
        </ul>
    </form>
    <a href="#resolution" class="next-section">
        <p>continuer</p>
        <span class="material-icons">expand_more</span>
    </a>
</section>
{/if}

<style>
    #layers-select ul, #habillage ul {
        list-style-type: none;
        padding: 0;
    }
    #layers-select li, #habillage li {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: .5rem;
    }
    :global(#layers-select .Toggle__label, #habillage .Toggle__label) {
        /* Taille du label */
        /* flex: 1; */
        width: 9rem;
        font-size: var(--text-medium);
    }
    .habillage-style {
        background-color: var(--grey);
        width: 100%;
        padding: .5rem 1rem;
        margin-bottom: .5rem;
        border-left: 2px solid var(--dark-grey);
    }
    input[type="text"] { font-size: var(--text-small); }
</style>