<script>
    import { onMount } from 'svelte'
    import { feature } from 'topojson-client'
    import { select } from 'd3-selection'
    import { range } from 'd3-array'
    import { geoGraticule, geoGraticule10 } from 'd3-geo'
    import { geo_110m } from '../../assets/geo_110m.js'
    import { zTransform, zCat, proj, lyr, gratType, gratStep, urbanSize, zLevels, zColor, resType, res, showSnackbar } from '../../stores.js'
    import tooltip from '../../assets/tooltip.js'

    import { contours } from 'd3-contour'
    import { invert, geoCurvePath } from '../../assets/reliefUtils.js'


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

    // CHARGEMENT ASYNCHRONE
    // geo_50m et geo_10m
    let geo_50m, geo_10m
    const getGeo50m = async () => { 
        let {geo_50m} = await import('../../assets/geo_50m.js') 
        return geo_50m
    }
    getGeo50m().then(d => geo_50m = d)

    const getGeo10m = async () => { 
        let {geo_10m} = await import('../../assets/geo_10m.js')
        return geo_10m
    }
    getGeo10m().then(d => geo_10m = d)


    // RELIEF
    const getReliefGeojson = async (zLevel,seuils) => {
        let z
        switch (zLevel) {
            case '0':
                let { z110m } = await import('../../assets/relief.js')
                z = z110m
                break;
        
            case '1':
                let { z50m } = await import('../../assets/relief.js')
                z = z50m
                break;
            case '2':
                let { z10m } = await import('../../assets/relief.js')
                z = z10m
                break;
        }
        
        const d3Contours = contours().size([z.width, z.height]).thresholds(seuils)
        const geojsonXY = d3Contours(z[0])
        const geojsonLatLon = geojsonXY.map(d => invert(d, z.width, z.height))
        return geojsonLatLon
    }

    let z110m, z50m, z10m, zOnce = 0
    $: if ($lyr.includes('relief') && zOnce == 0) {
        showSnackbar.set({state: 'loading', message: 'Chargement du relief'})
        getReliefGeojson('0', $zLevels).then(d => z110m = d)
        getReliefGeojson('1', $zLevels).then(d => z50m = d)
        getReliefGeojson('2', $zLevels).then(d => {
            z10m = d
            showSnackbar.set({state: 'loaded', message: 'Relief chargé'})
        })
        ++zOnce
    }
    

    // URBAN
    // Filtre la couche urban selon un seuil d'habitants 
    // défini par des boutons dans Layers.svelte
    // Le résultat est remis dans une 'FeatureCollection' = 1 seul path
    // Sinon le navigateur ne pourrait pas afficher les >130000 path de chaque ville
    let urbanFilter

    // données récupérées lorsque la couche est activée
    const getUrban = async () => {
        let {default: urban} = await import('../../assets/basemap/urban.json')
        return feature(urban, urban.objects.urban)
    }

    let urbanOnce = 0
    $: if ($lyr.includes('urban') && urbanOnce == 0) {
        showSnackbar.set({state: 'loading', message: 'Chargement des zones urbaines'})

        getUrban().then(urban => {
            urbanFilter = {
                type: "FeatureCollection",
                features: urban.features.filter(d => d.properties.POP_2015 >= $urbanSize)
            }
            showSnackbar.set({state: 'loaded', message: 'Zones urbaines chargées'})
        })
        ++urbanOnce
    }

    // LAYERS with 3 resolutions
    // 3 catégories de facteur de zoom
    $: $zCat = $zTransform.k <= 4 
                ? 'low' : $zTransform.k <= 17 
                ? 'medium' 
                : 'high'

    let geo, zRelief
    $: { if ($resType == "dynamic") { 
        switch ($zCat) {
            case 'low':
                geo = geo_110m
                zRelief = z110m
                $res = '110m'
                break
            case 'medium':
                geo = geo_50m ? geo_50m : geo_110m // affiche 110m en attendant async 50m
                zRelief = z50m
                $res = '50m'
                break
            case 'high': 
                geo = geo_10m ? geo_10m : geo_110m
                zRelief = z10m
                $res = '10m'
                break
        }
      }
      else {
          switch ($res) {
              case '110m': 
                geo = geo_110m
                zRelief = z110m
                break
              case '50m': 
                geo = geo_50m ? geo_50m : geo_110m 
                zRelief = z50m
                break
              case '10m': 
                geo = geo_10m ? geo_10m : geo_110m
                zRelief = z10m
                break
          }
      }
    }

    // Tooltip des pays par dessus toute les couches
    function tooltipON(e) {
        select("#gBasemap").append(
            () => e.target.cloneNode(false))
            .classed('hover', true)
            .style("pointer-events", "none")
    }
    function tooltipOFF() {
        select('.countries.hover').remove()
    }
</script>



<mask id="oceanLand">
    <path d="{path(outline)}" fill="white" />
    <path d="{path(geo.land)}" fill="black" />
</mask>
<clipPath id="land">
    <path d={path(geo.land)} />
</clipPath>

<g id='gBasemap' style="clip-path: url(#clip)">

    <path id="ocean" d="{path(outline)}" mask="url(#land)" style="visibility: hidden"/>
    
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

    <path id="coastline" d="{path(geo.coastline)}" style="visibility: hidden"/>

    <g id="countries">
        {#each geo.countries.features as country}
        <path use:tooltip={{content: country.properties.name, followCursor: true, placement: 'right' }}
                id='{country.properties.id}' class="countries"
                d="{path(country)}" 
                on:mouseenter|stopPropagation={tooltipON} 
                on:mouseleave={tooltipOFF} />
        {/each}
    </g>


    <g id="relief" clip-path="url(#land)" class:ShadeColor={$zColor}>
        {#if $lyr.includes('relief') && zRelief}
        {#each zRelief as d}
        <path class="levelRelief" d="{geoCurvePath($proj)(d)}" />
        {/each}
        {/if}
    </g>

    <g id="hydro">
        {#if $lyr.includes('hydro')}
        <path id='rivers' d="{path(geo.rivers)}"></path>
        <path id='lakes' d="{path(geo.lakes)}"></path>
        {/if}
    </g>

    <path id='borders' d="{path(geo.borders)}" style="visibility: hidden"></path>

    <path id='urban' d="{path(urbanFilter)}" style="visibility: hidden"></path>
</g>


<style>
    .gratTop:hover { stroke: var(--accent-color-light); stroke-width: 4; }
    .countries:focus, .gratTop:hover { outline: none; }
</style>