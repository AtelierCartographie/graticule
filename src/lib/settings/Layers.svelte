<script>
    import { select } from 'd3-selection'
    import { onMount } from 'svelte'
    import Tip from './Tip.svelte'
    import Styling from './Styling.svelte'
    import Toggle from './Toggle.svelte'
    import layers_list from '../../assets/layers_list.js'

    export let canRender
    let lyr_selected = ['ocean', 'land', 'borders']

    //Tips message
    let m1 = "Ajouter si besoin des informations supplémentaires"

    function addLayer(lyr) {
        const base = select("g#basemap")
        // Couches hidden par défault
        base.selectChildren().style("visibility", "hidden").classed("hidden", true) 
        // Pour chaque bouton radio sélectionné => rendre visible le layer
        lyr.forEach(e => select("g#basemap").select(`#${e}`).style("visibility", "visible").classed("hidden", false))
        // Cas particulier de l'échelle graphique
        lyr.includes("scaleBar") ? select("g#scaleBar").style("visibility", "visible") : select("g#scaleBar").style("visibility", "hidden")
    }

    $: addLayer(lyr_selected)
    
    onMount( () => {
        // applique la couche par défaut au démarrage
        addLayer(lyr_selected)
    })
</script>

{#if canRender}
<section id="layers" class="settings-section">
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
    <form id="title-scale">
        <h3>Habillage</h3>
        <ul>
                <li>
                    <Toggle label="Échelle" id="scale" name="Échelle" value="scaleBar" bind:bindGroup={lyr_selected} />
                    <!-- <label for={id}>{name}</label>
                    <input type="checkbox" bind:group={lyr_selected} id={id} value={id} {name} > -->
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
    #layers-select ul, #title-scale ul {
        list-style-type: none;
        padding: 0;
    }
    #layers-select li, #title-scale ul {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 1rem;
    }
    :global(#layers-select .Toggle__label, #title-scale .Toggle__label) {
        /* Taille du label */
        /* flex: 1; */
        width: 9rem;
        font-size: var(--text-medium);
    }
</style>