<script>
    import { blur } from "svelte/transition";
    import { range } from 'd3'
    import { geoGraticule, geoGraticule10 } from 'd3-geo'
    import geo from '../../assets/geo.js' // couches du fond de carte (topojson > geojson)
    import { gratType, gratStep, urbanSize } from '../../stores.js'
    import tooltip from '../../assets/tooltip.js'

    export let path, outline

    // GRATICULES
    const geoLine = (value, direction, precision = "2.5") => {
        const v = parseFloat(value)
        const step = parseFloat(precision)
        switch (direction) {
            case 'latitude':
            case 'lat':
                return range(-180, 180, step).concat(180).map(x => [x,v])
                
            case 'longitude':
            case 'long':
            case 'lon':
                return range(-90, 90, step).concat(90).map(y => [v,y])
                
            default:
                return console.log(`'${direction}' n'est pas une valeur de direction possible. 'lat' ou 'long' attendu`)
        }
    }
    const geographicLines = {
        type: "MultiLineString",
        coordinates: [
            geoLine(66.563, 'lat'),            // Cercle polaire arctique
            geoLine(23.436, 'lat'),            // Tropique du Cancer
            [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]],   // Équateur
            geoLine(-23.436, 'lat'),           // Tropique du Capricorne
            geoLine(-66.563, 'lat'),           // Cercle polaire antarctique
            [[0, -90], [0, 0], [0, 90], [180,0], [180,-90]]        // Méridien de Greenwitch
        ]
    }

    $: graticule = (
        $gratType == 'top'
        ? geographicLines
        : $gratStep == 10 
            ? geoGraticule10() 
            : geoGraticule().step([$gratStep, $gratStep])()
    )


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
        <path id='graticule' d="{path(graticule)}" style="visibility: hidden"></path>

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