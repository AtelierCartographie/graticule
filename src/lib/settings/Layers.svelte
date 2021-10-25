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
    }

    $: addLayer(lyr_selected)
    
    onMount( () => {
        // applique la couche par défaut au démarrage
        addLayer(lyr_selected)
    })
</script>

{#if canRender}
<section id="layers">
    <h2>3. Alimenter</h2>
    <Tip message={m1} />
    <form id="layers-select">
        <h3>Informations géographiques</h3>
        <ul>
            {#each layers_list as {id, name, style} }
                <li>
                    <Toggle label={name} {id} {name} value={id} bind:bindGroup={lyr_selected} />
                    <!-- <label for={id}>{name}</label>
                    <input type="checkbox" bind:group={lyr_selected} id={id} value={id} {name} > -->
                    <Styling lyr={id} {style} disabled={lyr_selected.includes(id) ? false : true} />
                </li>
            {/each} 
        </ul>
    </form>
</section>
{/if}

<style>
    #layers {
        margin-bottom: var(--step-gap);
    }
    #layers-select ul {
        list-style-type: none;
        padding: 0;
    }
    #layers-select li {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 1rem;
    }
    :global(#layers-select .Toggle__label) {
        /* Taille du label */
        /* flex: 1; */
        width: 10rem;
        font-size: var(--text-medium);
    }
    #layers-select input {
        /* Taille de l'input par rapport au label (1x, 2x...) */
        flex: .1;
    }
</style>