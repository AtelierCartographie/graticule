<script>
    import { select } from 'd3-selection'
    import { onMount } from 'svelte'
    import Tip from './Tip.svelte'

    export let layers_list
    export let lyr_selected

    //Tips message
    let m1 = "Ajouter si besoin des informations supplémentaires"

    function add_layer(lyr) {
        const base = select("g#basemap")
        // Couches hidden par défault
        base.selectChildren().style("visibility", "hidden").classed("hidden", true) 
        // Pour chaque bouton radio sélectionné => rendre visible le layer
        lyr.forEach(e => select("g#basemap").select(`#${e}`).style("visibility", "visible").classed("hidden", false))
    }

    $: add_layer(lyr_selected)

    onMount( () => {
        // applique la couche par défaut au démarrage
        add_layer(lyr_selected)
    })  
</script>

<Tip message={m1} />
<form id="layers-select">
    <h3>Afficher/masquer une couche</h3>
    <ul>
        {#each Object.entries(layers_list) as [name, value]}
            <li>
                <label for={value}>{name}</label>
                <input type="checkbox" bind:group={lyr_selected} id={value} {value} {name}>
            </li>
            
        {/each}
    </ul>
</form>


<style>
    #layers-select h3 {
        font-size: var(--text-big)
    }
    #layers-select ul {
        list-style-type: none;
        padding: 0;
    }
    #layers-select li {
        display: flex;
        justify-content: flex-end;
    }
    #layers-select label {
        /* Taille du label */
        flex: 1; 
    }
    #layers-select input {
        /* Taille de l'input par rapport au label (1x, 2x...) */
        flex: 1;
    }
</style>