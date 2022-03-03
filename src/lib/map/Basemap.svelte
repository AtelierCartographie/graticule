<script>
    // import { feature } from 'topojson-client'
    import { select } from 'd3-selection'
    import { range } from 'd3-array'
    import { geoGraticule, geoGraticule10, geoDistance, geoCircle } from 'd3-geo'
    import { symbol, symbolCircle, symbolSquare } from 'd3-shape'
    import { geo110m } from '../js/geo110m.js'
    import tooltip from '../js/tooltip.js'
    import { isLyr } from '../js/isLyr.js'
    import { zTransform, zCat, isZooming, proj, gratType, gratStep, lyr, urbanSize,
             citiesType, reliefLevels, reliefColor, resType, res, showSnackbar, showTissot } from '../../stores.js'

    import { contours } from 'd3-contour'
    import { invert, geoCurvePath } from '../js/reliefUtils.js'

    export let path, outline

    let isRelief, isCities, isHydro
    $: {
        $lyr
        isRelief = isLyr('relief')
        isCities = isLyr('cities')
        isHydro = isLyr('hydro')
    }

    /* --------------------------------- */
    /* GRATICULES
    /* A. Générateur de lignes spécifiques
    /* B. Générer les lignes remarquables (équateur, tropiques...)
    /* C. Graticules réguliés avec écart en degré sélectionné par l'utilisateur
    /* --------------------------------- */
    // Générateur de méridiens ou parallèles
    // Produit un geojson de type ligne à partir :
    // - une valeur en degré ()
    // - une direction (latitude ou longitude)
    // - un nom passé en propriété du geojson
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
                ? geojson.geometry.coordinates = [[-180, v], [-90, v], [0, v], [90, v], [180, v]] // Équateur
                : geojson.geometry.coordinates = range(-180, 180, step).concat(180).map(x => [x,v])
                break
            case 'longitude':
            case 'long':
            case 'lon':
                v == 0 || v == 180
                ? geojson.geometry.coordinates = [[v, 90], [v, 0], [v, -90]] // Greenwitch || Antiméridien
                : geojson.geometry.coordinates = range(-90, 90, step).concat(90).map(y => [v,y])
                break
            default:
                return console.log(`'${direction}' n'est pas une valeur de direction possible. 'lat' ou 'long' attendu`)
        }
        return geojson
    }

    // B.
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

    // C.
    $: graticule = (
        $gratType == 'top'
        ? geographicLines
        : $gratStep == 10 
            ? geoGraticule10() 
            : geoGraticule().step([$gratStep, $gratStep])()
    )


    /* --------------------------------- */
    /* INDICATEUR DE TISSOT
    /* D'après Mike Bostock, https://observablehq.com/@d3/tissots-indicatrix
    /* Génération de cercles de diamètre constant
    /* Révèle les distorsions de surface et de forme
    /* --------------------------------- */
    const addTissot = () => {
        const step = 20;
        const circle = geoCircle().center(d => d).radius(step / 6).precision(10);
        const coordinates = [];
        for (let y = -80; y <= 80; y += step) {
            for (let x = -180; x < 180; x += step) {
            coordinates.push(circle([x, y]).coordinates);
            }
        }
        return {type: "MultiPolygon", coordinates};
    }
    const tissot = addTissot()

    /* --------------------------------- */
    /* CHARGEMENT ASYNCHRONE DE COUCHE
    /* geo10m -> si connection lente (>3s), notification à l'utilisateur
    /* --------------------------------- */
    // geo50m et geo10m
    let geo50m, geo10m
    const getGeo50m = async () => {
        let {geo50m} = await import('../js/geo50m.js')
        return geo50m
    }
    getGeo50m().then(d => geo50m = d)

    const getGeo10m = async () => { 
        let isSlow = false
        const network = setTimeout(() => {
            isSlow = true
            showSnackbar.set({state: 'loading', message: 'Connexion lente... Chargement de la totalité du fond'})
        }, 3000);

        let {geo10m} = await import('../js/geo10m.js')

        clearTimeout(network)
        if (isSlow) showSnackbar.set({state: 'loaded', message: 'Fond chargé'})

        return geo10m
    }
    getGeo10m().then(d => geo10m = d)

    /* --------------------------------- */
    /* RELIEF -> async à l'activation
    /* A. Récupère les 3 résolutions de données d'élévations
    /* B. Convertit en polygone de contours (geojson) selon des seuils d'élévations
    /* C. Met à jour B. si changement de seuils
    /* --------------------------------- */
    const getRelief = async (rLevel) => {
        let r
        switch (rLevel) {
            case '0':
                const { r110m } = await import('../js/relief.js')
                r = r110m
                break;
        
            case '1':
                const { r50m } = await import('../js/relief.js')
                r = r50m
                break;
            case '2':
                const { r10m } = await import('../js/relief.js')
                r = r10m
                break;
        }
        
        return r
    }
    const relief2geojson = async (r, seuils) => {
        const d3Contours = await contours().size([r.width, r.height]).thresholds(seuils.split(","))
        const geojsonXY = await d3Contours(r[0])
        const geojsonLatLon = geojsonXY.map(d => invert(d, r.width, r.height))
        
        return geojsonLatLon
    }

    let r0, r1, r2
    let r110m, r50m, r10m, rOnce = 0
    $: if (isRelief && rOnce == 0) {
        showSnackbar.set({state: 'loading', message: 'Chargement du relief'})
        getRelief('0').then(async d => r0 = d)
        getRelief('1').then(async d => r1 = d)
        getRelief('2').then(async d => {
            r2 = d
            showSnackbar.set({state: 'loaded', message: 'Relief chargé'})
        })
        ++rOnce
    }
    $: if (r0) {
        relief2geojson(r0, $reliefLevels).then(d => r110m = d)
        relief2geojson(r1, $reliefLevels).then(d => r50m = d)
        relief2geojson(r2, $reliefLevels).then(d => r10m = d)
    }
    
    /* --------------------------------- */
    /* CITIES -> async à l'activation
    /* A. Récupérer les données
    /* B. Filtrer selon choix utilisateurs (capitale ou seuil population)
    /* C. Prendre en compte du clipAngle de certaines projections
    /* --------------------------------- */
    let cities = [],      // stock tous les villes
        citiesFilter = [] // stock seulement les villes filtrées

    // Récupère la liste des villes + capitales
    const getCities = async () => {
        let {cities} = await import('../js/cities.js')
        return cities
    }

    // Charge les données, seulement à la première activation de la couche
    let citiesOnce = true
    $: if (isCities && citiesOnce) {
        showSnackbar.set({state: 'loading', message: 'Chargement des villes'})
        getCities().then(d => {
            cities = d
            showSnackbar.set({state: 'loaded', message: 'Villes chargées'})
        })
        citiesOnce = !citiesOnce
    }

    // Détermine les villes à l'intérieur ou en dehors du clip de la projection
    // retourne une valeur css de "visibility" (hidden ou visible)
    // D'après Andrew Reid, https://stackoverflow.com/a/48162235
    const cityVisible = (lon, lat, proj) => {
        const clipAngle = proj.clipAngle()
        if (clipAngle == 0) return 'visible'

        const circle = [lon, lat]
		const rotate = proj.rotate() // antipode of actual rotational center.
		const center = [-rotate[0], -rotate[1]]
		const distance = geoDistance(circle,center)
        const angleRad = clipAngle * (Math.PI/180) // degrees to radians
		return (distance > angleRad ) ? 'hidden' : 'visible'
    }

    $: if (isCities && !citiesOnce && !$isZooming) {
        switch ($citiesType) {
            case 'cap':
                citiesFilter = cities.filter(d => d.capital == 1)
                break
            case '>100k':
                citiesFilter = cities.filter(d => d.urbanCenter == 1)
                break
            case '>250k':
                citiesFilter = cities.filter(d => d.pop2015Cat == '>250k' || d.pop2015Cat == '>500k')
                break
            case '>500k':
                citiesFilter = cities.filter(d => d.pop2015Cat == '>500k')
                break
        }
        citiesFilter = citiesFilter.map(d => ({...d, visibility: cityVisible(d.lon, d.lat, $proj)}))
    }

    /* --------------------------------- */
    /* GESTION DES COUCHES À 3 RÉSOLUTIONS
    /* A. Déterminer les seuils de zoom déclenchant le changement de résolution
    /* B. Différencier le comportement dynamique par défaut d'un choix constant par l'utilisateurs 
    /* C. Afficher, en fonction de A. et B., les bonnes résolutions de couches
    /* --------------------------------- */
    // 3 catégories de facteur de zoom
    $: $zCat = $zTransform.k <= 4 
                ? 'low' : $zTransform.k <= 17 
                ? 'medium' 
                : 'high'

    let geo, zRelief
    // Dynamique -> cas par défaut 
    $: { if ($resType == "dynamic" && !$isZooming) { 
        switch ($zCat) {
            case 'low':
                geo = geo110m
                zRelief = r110m
                $res = '110m'
                break
            case 'medium':
                geo = geo50m ? geo50m : geo110m // affiche 110m en attendant async 50m
                zRelief = r50m
                $res = '50m'
                break
            case 'high': 
                geo = geo10m ? geo10m : geo110m
                zRelief = r10m
                $res = '10m'
                break
        }
      }
      // Constant -> choix utilisateur
      else {
          switch ($res) {
              case '110m': 
                geo = geo110m
                zRelief = r110m
                break
              case '50m': 
                geo = geo50m ? geo50m : geo110m 
                zRelief = r50m
                break
              case '10m': 
                geo = geo10m ? geo10m : geo110m
                zRelief = r10m
                break
          }
      }
    }

    // Pendant le zoom bascule sur la plus faible résolution pour un gain de performance
    $: if ($isZooming) { 
        geo = geo110m
        zRelief = r110m
        citiesFilter = cities.filter(d => d.capital == 1)

        // Nettoie les doublons de pays highlight
        tooltipOFF()
    }

    /* --------------------------------- */
    /* TOOLTIP DES PAYS
    /* Pour que l'highlight du polygone ne soit pas masquer par le relief
    /* le pays survoler est copier et ajouter par dessus toutes les couches
    /* à la sortie du survol, le path copié est supprimé
    /* --------------------------------- */
    function tooltipON(e) {
        select("#gBasemap")
            .append( () => e.target.cloneNode(false) )
            .classed('hover', true)
            .style("pointer-events", "none")
    }
    function tooltipOFF() {
        select('.countries.hover').remove()
    }

    // NON UTILISÉ
    // URBAN (zones urbaines denses, polygones), d'après le Global Human Settlement
    // Filtre la couche urban selon un seuil d'habitants 
    // défini par des boutons dans Layers.svelte
    // Le résultat est remis dans une 'FeatureCollection' = 1 seul path
    // Sinon le navigateur ne pourrait pas afficher les >130000 path de chaque ville
    // let urban,      // tous les polygones
    //     urbanFilter // seulement les polygones filtrés

    // // données récupérées lorsque la couche est activée
    // const getUrban = async () => {
    //     let {default: urban} = await import('../../assets/basemap/urban.json')
    //     return feature(urban, urban.objects.urban)
    // }

    // let urbanOnce = 0
    // $: if (isUrban && urbanOnce == 0) {
    //     showSnackbar.set({state: 'loading', message: 'Chargement des zones urbaines'})

    //     getUrban().then(d => {
    //         urban = d
    //         urbanFilter = {
    //             type: "FeatureCollection",
    //             features: d.features.filter(d => d.properties.POP_2015 >= $urbanSize)
    //         }
    //         showSnackbar.set({state: 'loaded', message: 'Zones urbaines chargées'})
    //     })
    //     ++urbanOnce
    // } else if (isUrban && urbanOnce >= 1) {
    //     urbanFilter = {
    //             type: "FeatureCollection",
    //             features: urban.features.filter(d => d.properties.POP_2015 >= $urbanSize)
    //         }
    // }
</script>



<clipPath id="clip-land">
    <path d={path(geo.land)} />
</clipPath>



<g id='gBasemap' style="clip-path: url(#clip-outline)">

    <path id="ocean" d="{path(geo.ocean)}" style="visibility: hidden"/>

    <path id="outline" d="{path(outline)}" style="visibility: visible !important; stroke-width:{2 / $zTransform.k}px;"/>
    
    <g id='graticule'>
        {#if $gratType == 'top'}
            {#each graticule.features as d}
                <path use:tooltip={{content: d.properties.name, followCursor: true, placement: 'right' }}
                        class="gratTop"
                        d="{path(d)}"
                        stroke-dasharray={d.properties.name == 'Équateur' ? 0 : 6 / $zTransform.k}></path>
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


    <g id="relief" clip-path="url(#clip-land)" class:ShadeColor={$reliefColor}>
        {#if isRelief && zRelief}
        {#each zRelief as d}
        <path class="levelRelief" d="{path(d)}" />
        {/each}
        {/if}
    </g>

    <g id="hydro">
        {#if isHydro}
        <path id='rivers' d="{path(geo.rivers)}"></path>
        <path id='lakes' d="{path(geo.lakes)}"></path>
        {/if}
    </g>

    <path id='borders' d="{path(geo.borders)}" style="visibility: hidden"></path>

    <g id="cities">
        {#if isCities && citiesFilter}
        {#each citiesFilter as d}
            <path class="city"
            use:tooltip={{content: `<i>${d.name}</i>`, allowHTML: true, followCursor: true, placement: 'right' }}
            d={d.capital == 1 
                // carrés => capitales
                ? symbol(symbolSquare, 6 / $zTransform.k)()
                // cercles => autres
                : symbol(symbolCircle, 3 / $zTransform.k)()}  
            transform={`translate(${$proj([d.lon,d.lat])[0]},${$proj([d.lon,d.lat])[1]})`}
            style="visibility: {d.visibility}" />
        {/each}
        {/if}
    </g>

    {#if $showTissot}
    <path id="tissot" d="{path(tissot)}" style="visibility: visible !important"/>
    {/if}

    <!-- <path id='urban' d="{path(urbanFilter)}" style="visibility: hidden"></path> -->
</g>


<style>
    .gratTop:hover { stroke: var(--accent-color-light); stroke-width: 4; }
    .countries:focus, .gratTop:hover, .city:hover { outline: none; }
    .city:hover { stroke: var(--accent-color-medium); stroke-opacity: 1; }
    #tissot { fill: var(--accent-color); fill-opacity: 0.3; stroke: none; }
</style>