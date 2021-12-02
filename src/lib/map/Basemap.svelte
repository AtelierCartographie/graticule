<script>
    import { blur, draw } from "svelte/transition";
    import { range } from 'd3'
    import { geoGraticule, geoGraticule10 } from 'd3-geo'
    import geo from '../../assets/geo.js' // couches du fond de carte (topojson > geojson)
    import { gratType, gratStep, urbanSize } from '../../stores.js'
    import tooltip from '../../assets/tooltip.js'

    export let path, outline

    // GRATICULES
    const geoLine = (value, direction, name, precision = "2.5") => {
        const v = parseFloat(value)
        const step = parseFloat(precision)
        const geojson = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": []
            },
            "properties": {
                "name": name
            }
        }
        switch (direction) {
            case 'latitude':
            case 'lat':
                v == 0
                ? geojson.geometry.coordinates = [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]] // Équateur
                : geojson.geometry.coordinates = range(-180, 180, step).concat(180).map(x => [x,v])
                break
            case 'longitude':
            case 'long':
            case 'lon':
                v == 0
                ? geojson.geometry.coordinates = [[0, 90], [0, 0], [0, -90]] // Greenwitch
                : v == 180
                ? geojson.geometry.coordinates = [[180, 90], [180,0], [180,-90]] // Antiméridien
                : geojson.geometry.coordinates = range(-90, 90, step).concat(90).map(y => [v,y])
                break
            default:
                return console.log(`'${direction}' n'est pas une valeur de direction possible. 'lat' ou 'long' attendu`)
        }
        return geojson
    }

    const geographicLines = {
        type: "FeatureCollection",
        features: [
            geoLine(66.563, 'lat', "Cercle polaire arctique"),      // Cercle polaire arctique
            geoLine(23.436, 'lat', "Tropique du Cancer"),           // Tropique du Cancer
            geoLine(0, 'lat', "Équateur"),                          // Équateur
            geoLine(-23.436, 'lat', "Tropique du Capricorne"),      // Tropique du Capricorne
            geoLine(-66.563, 'lat', "Cercle polaire antarctique"),  // Cercle polaire antarctique
            geoLine(0, 'lon', "Méridien de Greenwitch"),            // Méridien de Greenwitch
            geoLine(180, 'lon', "Antiméridien"),                    // Antiméridien
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

        <path id="ocean" d="{path(outline)}" transition:draw="{{ duration: 4000 }}" style="visibility: hidden"/>
        <g id='graticule'>
            {#if $gratType == 'top'}
                {#each graticule.features as d}
                    <path use:tooltip={{content: d.properties.name, followCursor: true, placement: 'right' }}
                            class="gratTop"
                            d="{path(d)}"></path>
                {/each}
            {:else}
            <path class="gratAll" d="{path(graticule)}"></path>
            {/if}
        </g>
       
        

        {#each Object.entries(geo) as [name, fn]}
            {#if name == 'urban'}
            <path transition:draw="{{ duration: 4000 }}" id='{name}' d="{path(urbanFilter)}" style="visibility: hidden"></path>
            {:else if name == 'countries'}
            <g id="countries">
                {#each fn.features as country}
                <path use:tooltip={{content: country.properties.name, followCursor: true, placement: 'right' }} 
                        transition:draw="{{ duration: 4000 }}"
                        id='{country.properties.id}' class="countries"
                        d="{path(country)}"></path>
                {/each}
            </g>
            {:else}
            <path transition:draw="{{ duration: 10000 }}" id='{name}' d="{path(fn)}" style="visibility: hidden"></path>
            {/if}
        {/each}
    </g>
{/if}

<style>
    .countries:hover { fill: var(--accent-color-light); }
    .gratTop:hover { stroke: var(--accent-color-light); stroke-width: 4; }
    .countries:focus, .gratTop:hover { outline: none; }
</style>