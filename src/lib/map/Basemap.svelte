<script>
    import { blur } from "svelte/transition";
    import { geoGraticule10 } from 'd3-geo'
    import geo from '../../assets/geo.js' // couches du fond de carte (topojson > geojson)
    import { urbanSize } from '../../stores.js'
    import tooltip from '../../assets/tooltip.js'

    export let path, outline


    // Filtre la couche urban selon un seuil d'habitants 
    // défini par des boutons dans Layers.svelte
    // Le résultat est remis dans une 'FeatureCollection' = 1 seul path
    // Sinon le navigateur ne pourrait pas afficher les >130000 path de chaque ville
    $: urbanFilter = {
        type: "FeatureCollection",
        features: geo.urban.features.filter(d => d.properties.POP_2015 >= $urbanSize)
    }

    // Par défaut les transitions ne se font qu'à l'apparition/création de l'élément dans le DOM
    // pour les activers quand une valeur de variable change il faut utiliser #key
    // https://svelte.dev/tutorial/key-blocks
</script>

{#if geo}
    <g id='gBasemap' style="clip-path: url(#clip)">

        <path id="ocean" d="{path(outline)}" transition:blur="{{ duration: 1500 }}" style="visibility: hidden"/>
        <path id='graticule' d="{path(geoGraticule10())}" style="visibility: hidden"></path>

        {#each Object.entries(geo) as [name, fn]}
            {#if name == 'urban'}
            <path transition:blur="{{ duration: 1500}}" id='{name}' d="{path(urbanFilter)}" style="visibility: hidden"></path>
            {:else if name == 'countries'}
            <g id="countries">
                {#each fn.features as country}
                <path use:tooltip={{content: country.properties.name, followCursor: true, placement: 'right' }} 
                        transition:blur="{{ duration: 1500}}"
                        id='{country.properties.id}' class="countries"
                        d="{path(country)}"></path>
                {/each}
            </g>
            {:else}
            <path transition:blur="{{ duration: 1500}}" id='{name}' d="{path(fn)}" style="visibility: hidden"></path>
            {/if}
        {/each}
    </g>
{/if}

<style>
    .countries:hover { fill: var(--accent-color-light); }
    .countries:focus { outline: none; }
</style>