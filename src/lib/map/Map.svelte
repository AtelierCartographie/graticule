<script>
    import { onMount } from 'svelte'
    import { proj, regbbox, countrybbox, zTransform, isZooming, mapTheme, lyr, mapTitle, scaleDist, mapReady, scaleBarLeft, scaleBarTop, zResetMessage, callZoomReset, rectBrush, downloadStep, adaptProj, frameCenter } from '../../stores.js'
    import { geoPath } from 'd3-geo'
    import { select } from 'd3-selection'
    import { brush } from 'd3-brush'
    import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom'
    import { drag } from 'd3-drag'
    import { geoScaleBar } from 'd3-geo-scale-bar'
    import Basemap from './Basemap.svelte'
    import tooltip from '../js/tooltip.js'
    import { isLyr } from '../js/isLyr.js'

    export let width, height // dimensions du svg

    let isCities, isScaleBar, isRelief
    $: {
        $lyr
        isCities = isLyr('cities')
        isScaleBar = isLyr('scaleBar')
        isRelief = isLyr('relief')
    }

    // hauteur du cadrage de la carte = laisse de la place pour le titre et le crédit
    const mapMargin = (height * 0.05) / 2
    const mapHeight = height - mapMargin

    // Affiche les sources selon les couches actives
    const getCredit = (city, relief) => {
        if (city && !relief) return "Sources : Natural Earth ; European Commission, JRC, GHS, 2019. Réalisé avec Graticule."
        if (!city && relief) return "Sources : Natural Earth ; Terrain Tiles, Nextzen. Réalisé avec Graticule."
        if (city && relief) return  "Sources : Natural Earth ; European Commission, JRC, GHS, 2019 ; Terrain Tiles, Nextzen. Réalisé avec Graticule."
        return "Source : Natural Earth. Réalisé avec Graticule."
    }
    $: mapCredit = getCredit(isCities, isRelief)

    /* --------------------------------- */
    /* PROJECTION
    /* Calcul du geoPath en fonction de la projection
    /* Application d'un clip à l'étape télécharger
    /* pour un véritable clip à l'export
    /* --------------------------------- */
    // Clip à la volée au rectangle de cadrage initial
    // /!\ ne prend pas en compte le brush manuel de l'utilisateur
    const xProjected = (d) => (d - $zTransform.x) / $zTransform.k
    const yProjected = (d) => (d - $zTransform.y) / $zTransform.k
    let extent = null
    $: {
        $zTransform // recalcule l'extent à chaque changement de zoom (translate + scale)
        $proj // idem pour la projection et ses paramètres
        // [[x0,y0], [x1,y1]], coordonnées projetées planes de la carte (en pixels)
        extent = [[xProjected(0-10),yProjected(mapMargin-10)], [xProjected(width+10),yProjected(mapHeight+10)]]
    }

    // PATH : centrage carte + clip au cadrage
    let outline = ({type: "Sphere"})
    $: path = $downloadStep
        // Si étape Télécharger
        ? geoPath($proj.fitExtent([[0, mapMargin], [width, mapHeight]], outline).clipExtent(extent))
        // le reste du temps
        : geoPath($proj.fitExtent([[0, mapMargin], [width, mapHeight]], outline).clipExtent(null))

    // ADAPTER la projection au cadrage
    // récupérer les coordonnées projetées en pixel de la carte du centre du cadrage
    // convertir en coordonnées non-projetées [longitude, latitude]
    const getCenter = () => {
        const x = xProjected(rx + rw / 2)
        const y = yProjected(ry + rh / 2)

        return $proj.invert([x,y]) // [lon,lat]
    }

    $: if ($adaptProj) {
        $frameCenter = getCenter()
        $adaptProj = false
    }

    
    /* --------------------------------- */
    /* BRUSH
    /* Utilise d3-brush pour générer et modifier un rectangle de cadrage
    /* Désactive certains events => empêcher de refaire un nouveau brush, seulement modifier l'existant
    /* UI => positionement des flèches svg pour l'utilisateur
    /* --------------------------------- */
    let rx, ry, rw, rh // stocke dimensions du rectangle de cadrage
    function brushed( { selection: [[x0, y0], [x1, y1]] } ) {        
        // passer les coordonnées du brush courant
        // au clip de cadrage => clipPath #clip-cadrage
        rx = x0 - 5
        ry = y0 - 5
        rw = x1 - x0 + 10
        rh = y1 - y0 + 10

        $rectBrush = { rx, ry, rw, rh }
    }

    let Brush = brush()
        .filter(event => !event.ctrlKey
          && !event.button
          && !select(event.target).classed("selection"))
        .handleSize(24)
        .on("brush", brushed)

    // Positions des symboles de flèche 
    // pour mettre en avant le recadrage utilisateur
    $: xyCropTop = "translate(" + (rx + rw / 2) + "," + (ry + 5) + ")"
    $: xyCropRight = "translate(" + (rx + rw - 28) + "," + (ry + rh / 2) + ")"
    $: xyCropBottom = "translate(" + (rx + rw / 2) + "," + (ry + rh - 28) + ")"
    $: xyCropLeft = "translate(" + (rx + 5) + "," + (ry + rh / 2) + ")"
    


    /* --------------------------------- */
    /* SCALE BAR
    /* Utilise d3-geo-scale-bar pour générer une échelle graphique
    /* l'échelle est généré à l'activation de la couche
    /* elle peut être déplacé en prenant en compte le positionnement dans la projection
    /* la distance peut être changé par l'utilisateur
    /* le facteur de zoom est compensé pour la longueur du trait et la taille du texte
    /* --------------------------------- */
    let scaleInitDist = 2000 // distance de l'échelle en km
    let k = $zTransform.k == 1 ? 1 : $zTransform.k     // stock le facteur de zoom
    let zx = 0, zy = 0       // stock le translate du zoom
    let cx, cy               // centre du cadrage
    let zcx, zcy             // centre du cadrage dans la carte avec le zoom
    let left, top            // position de la légende
    // Détermine la position dans la projection du centre du cadrage
    $: if (isScaleBar) {
        // centre du cadrage
        cx = rx + rw / 2
        cy = ry + rh / 2
        // centre du cadrage dans la carte avec le zoom
        zcx = (cx - zx) / k
        zcy = (cy - zy) / k
        // position de l'échelle
        left = zcx / width
        top = zcy / mapHeight

        $scaleBarLeft == null || $scaleBarLeft == undefined ? $scaleBarLeft = left : $scaleBarLeft
        $scaleBarTop == null || $scaleBarTop == undefined ? $scaleBarTop = top : $scaleBarTop
    }
    
    const scaleBar = geoScaleBar()
        .projection($proj)
        .extent([[0, mapMargin], [width, mapHeight]])
        .distance(scaleInitDist)
        .radius(6371.0088)
        .labelAnchor("middle")
        .tickSize(null)
        .tickValues(null)
        .zoomFactor(k)

    // Initialise l'échelle graphique quand le toggle est activé
    $: if (isScaleBar) {
        select("#gScaleBar")
            .attr("cursor", "move")
            .call(scaleBar.left($scaleBarLeft).top($scaleBarTop))
            .call(dragScaleBar)
    }

    // Relance l'échelle si...
    $: {
        // Taille et épaisseur constante en compensant le zoom
        select("#gScaleBar .label").attr("font-size", 12 / k)
        select("#gScaleBar .domain").attr("stroke-width", 1.5 / k)

        // ... changement de projection
        if (isScaleBar) { select("#gScaleBar").call(scaleBar.projection($proj)) }

        if (isScaleBar) {
        // ... zoom (comportement dynamique par défaut sinon utilisateur fixe une distance)
        $scaleDist == null || $scaleDist == undefined
        ? select("#gScaleBar").call(scaleBar.distance(scaleInitDist / k)
                                            .label(`${Math.round(scaleBar.distance())} km`))
        : select("#gScaleBar").call(scaleBar.distance($scaleDist)
                                            .label(`${Math.round(scaleBar.distance())} km`))
        }
    }

    // Déplacer l'échelle graphique
    function dragged(event) {
        scaleBar.left(event.x / width).top(event.y / height) // passer des pixels du svg au 0-1 de scaleBar.left et .top
        select("#gScaleBar").attr("cursor", "grabbing").call(scaleBar)
        // stocke le nouveau positionnement de l'échelle graphique
        $scaleBarLeft = scaleBar.left()
        $scaleBarTop = scaleBar.top()
    }
    const dragScaleBar = drag()
        .on("drag", e => dragged(e))
        .on("end", () => select("#gScaleBar").attr("cursor", "move")) // retour au curseur d'origine




    /* --------------------------------- */
    /* ZOOM (d3-zoom)
    /* 3 types de zoom
    /* A. zoom utilisateur, du node d'appel et du node où il s'applique
    /* B. Zoom programmatique sur une région ou un pays
    /* C. Zoom programmatique par des boutons (zoomIn, zoomOut, zoomReset)
    /* Stockage du transform courant {x,y,k} pour être réutilisé dans des blocs réactifs
    /* --------------------------------- */

    // Fix bug webkit: Wheel event is not fired on a SVG group element in Safari
    // https://stackoverflow.com/a/67925459
    select(document.body).on('wheel.body', e => {})

    let zmin = 0.5,
        zmax = 100,
        zCall = "#gCadrage",
        zApply = "#gZoom"

    // paramètres du pan and zoom
    const d3zoom = zoom()
        .scaleExtent([zmin, zmax]) // min, max du zoom
        .translateExtent([[0, mapMargin], [width, mapHeight]]) // bornes extérieures du translate
        .on("zoom", ({ transform }) => {
            $isZooming = true
            select(zApply).attr("transform", transform).attr("cursor", "grabbing")
            
            // // utiliser par scaleBar
            // $zTransform = transform
            // k = transform.k
            // zx = transform.x
            // zy = transform.y
        })
        .on("end", ({ transform }) => {
            $isZooming = false
            select(zApply).attr("cursor", "grab")
            // utiliser par scaleBar
            $zTransform = transform
            k = transform.k
            zx = transform.x
            zy = transform.y
        })

    const d3zoomReload = zoom()
        .scaleExtent([zmin, zmax])
        .translateExtent([[0, mapMargin], [width, mapHeight]])
        .on("zoom", ({ transform }) => select(zApply).attr("transform", transform))

    // ZOOM SUR UNE ZONE SPÉCIFIQUE
    function zoomRegion(b) {
        if (b != null) {
            // Récupère les coordonnées en pixel de la bbox d'un geosjon
            const [[x0, y0], [x1, y1]] = path.bounds(b)

            // Voir exemple : https://observablehq.com/@d3/zoom-to-bounding-box
            select(zCall).transition().duration(1750).call(
                d3zoom.transform,
                zoomIdentity
                    .translate(width / 2, mapHeight / 2)
                    .scale(Math.min(zmax, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / mapHeight)))
                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
            ) 
        }
    }

    // Applique le zoom sur une zone à la sélection
    // et au changement de projection
    $: if ($mapReady) { 
        $proj
        zoomRegion($regbbox)
        zoomRegion($countrybbox)
    }

    // Boutons de contrôle du zoom
    // voir https://observablehq.com/@d3/programmatic-zoom
    const zoomIn = () => select(zCall).transition().call(d3zoom.scaleBy, 1.5)
    const zoomOut = () => select(zCall).transition().call(d3zoom.scaleBy, 1/1.5)
    const zoomReset = () => $regbbox == null && $countrybbox == null
            ?  select(zCall).transition().duration(1750).call(
                d3zoom.transform,
                zoomIdentity,
                zoomTransform(select(zCall).node()).invert([width / 2, mapHeight / 2]))
            : ( zoomRegion($regbbox), zoomRegion($countrybbox) )
    // Cas où l'utilisateur vide l'input de l'étape Cadrer
    $: if ($callZoomReset == true) {zoomReset(); $callZoomReset = false}



    // RELIEF -> taille de l'ombrage de l'effet Tanaka contours
    $: dropShadowOffset = (1 / k).toFixed(3)


    onMount( () => {
        // Zoom sur le dernier cadrage au rechargement de la page
        select(zCall).transition().duration(1750).call(
            d3zoomReload.transform,
            zoomIdentity.translate($zTransform.x, $zTransform.y)
                        .scale($zTransform.k))
        
        

        // BRUSH ----- initialise le cadrage avec d3-brush
        const { rx, ry, rw, rh } = $rectBrush
        let gBrush = select('#gBrush')

        gBrush.call(Brush)

        // Positionnement du rect de cadrage au lancement
        rx == null
        // si aucun rect cadrage préexistant
        ? gBrush.call(Brush.move, [[5, mapMargin + 5], [width-10, mapHeight-10]])
        // si rect cadrage déjà personnalisé = reload
        : gBrush.call(Brush.move, [[rx + 5, ry + 5], [rx + rw - 5, ry + rh - 5]])
            
            
        gBrush.select(".overlay").remove()  // empêche la création d'un nouveau brush
        gBrush.select(".selection")
            .attr("id", "cadrage")
            .classed("inView", true)
            .attr("fill", "none")
            .attr("stroke", "none")
            .attr("cursor", "auto")         // rétablit valeur par défaut
            .attr("pointer-events", "none") // ne bloque/cache pas les events en dessous (ici le zoom)

        // ZOOM ----- applique le zoom sur "g#gCadrage" plutôt que l'ensemble du svg
        // => limite le zoom à l'intérieur du cadrage (via d3-brush)
        // => évite les conflits d'event avec le brush
        select(zCall)
            .attr("cursor", "grab")
            .call(d3zoom)

        $mapReady = true
    })
</script>

<svg id="mapSvg" class={$mapTheme}
    width="100%" height="100%" viewBox="0 0 {width} {height}" 
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <clipPath id="clip-outline"><path d="{path(outline)}" /></clipPath>
        <clipPath id="clip-cadrage">
            <rect x={rx} y={ry} width={rw} height={rh} />
        </clipPath>
        <filter id="reliefShadow">
            <feDropShadow dx="{-dropShadowOffset}" dy="{-dropShadowOffset}" stdDeviation="0.05" flood-color="white" flood-opacity=".8"/>
            <feDropShadow dx="{dropShadowOffset}" dy="{dropShadowOffset}" stdDeviation="0.05" flood-color="black" flood-opacity=".8"/>
        </filter>
    </defs>

    {#if $mapReady}
    <text id="mapTitle" x={rx} y={ry} dy=-5>{$mapTitle}</text>
    <text id="mapCredit" x={rx + rw} y={ry + rh} dy=15>{mapCredit}</text>
    {/if}
    <g id="gCadrage" style="clip-path: url(#clip-cadrage)">
        <g id="gZoom" >        
            <Basemap {path} {outline} />
            <g id="gScaleBar" style="visibility: hidden"></g>
        </g>
    </g>
    
    <g id="gBrush">
        {#if $mapReady}
        <path id="cropTop" class="crop" transform={xyCropTop} d="M19,15l-1.41-1.41L13,18.17V2H11v16.17l-4.59-4.59L5,15l7,7L19,15z"/>
        <path id="cropRight" class="crop" transform={xyCropRight} d="M9,19l1.41-1.41L5.83,13H22V11H5.83l4.59-4.59L9,5l-7,7L9,19z"/>
        <path id="cropBottom" class="crop" transform={xyCropBottom} d="M5,9l1.41,1.41L11,5.83V22H13V5.83l4.59,4.59L19,9l-7-7L5,9z"/>
        <path id="cropLeft" class="crop" transform={xyCropLeft} d="M15,5l-1.41,1.41L18.17,11H2V13h16.17l-4.59,4.59L15,19l7-7L15,5z"/>
        {/if}
    </g>
        
    <style>
        #cadrage { fill: none; stroke: var(--accent-color); stroke-width: 2; stroke-dasharray: 0 6; stroke-linecap: round; transition-property: stroke, stroke-width, stroke-dasharray; transition-duration: .5s; }
        #cadrage.inView { stroke-width: 3; stroke-dasharray: none; }
        .crop { fill: var(--accent-color); opacity: 0; transition: opacity .5s; pointer-events: none; }
        #cadrage.inView ~ .crop { opacity: 1; }
        #mapSvg { background-color: white; }
        #mapTitle { font-size: 16px; font-weight: bold; font-family: "Fira Code", monospace; fill: var(--dark-grey); visibility: hidden; }
        #mapCredit { font-size: 12px; font-family: "Open sans", sans-serif; text-anchor: end; fill: var(--dark-grey); }

        #mapSvg.colorMode { 
            --ocean-fill: #F4FAFF;
            --ocean-fill-o: 1;
            --ocean-stroke: black;
            --ocean-stroke-o: 0.3;
            --ocean-stroke-w: 2;
            
            --grat-stroke: black;
            --grat-stroke-o: 0.3;
            --grat-stroke-w: 0.3;

            --coastline-stroke: #7D9CB3;
            --coastline-stroke-o: 1;
            --coastline-stroke-w: 1.5;

            --pays-fill: white;
            --pays-fill-o: 1;

            --relief-fill: #ffeee8;
            --relief-fill-o: 0.7;

            --borders-stroke: black;
            --borders-stroke-o: 0.3;
            --borders-stroke-w: 0.5;

            --hydro-stroke: #A9C1D1;
            --hydro-stroke-o: 1;
            --hydro-stroke-w: 0.5;

            --cities-fill: black;
            --cities-fill-o: 0.6;
            --cities-stroke: white;
            --cities-stroke-o: 0;
            --cities-stroke-w: 15;

            /* --urban-fill: black;
            --urban-fill-o: 1;
            --urban-stroke: none;
            --urban-stroke-o: 1;
            --urban-stroke-w: none; */
        }
        #mapSvg.outlineMode { 
            --ocean-fill: white;
            --ocean-fill-o: 1;
            --ocean-stroke: black;
            --ocean-stroke-o: 0.3;
            --ocean-stroke-w: 2;

            --grat-stroke: black;
            --grat-stroke-o: 0.3;
            --grat-stroke-w: 0.3;

            --coastline-stroke: black;
            --coastline-stroke-o: 1;
            --coastline-stroke-w: 1.5;
            
            --pays-fill: white;
            --pays-fill-o: 1;

            --relief-fill: #F2F2F2;
            --relief-fill-o: 0.7;

            --borders-stroke: black;
            --borders-stroke-o: 0.7;
            --borders-stroke-w: 0.5;

            --hydro-stroke: #D9D9D9;
            --hydro-stroke-o: 1;
            --hydro-stroke-w: 0.5;

            --cities-fill: black;
            --cities-fill-o: 0.6;
            --cities-stroke: white;
            --cities-stroke-o: 0;
            --cities-stroke-w: 15;

            /* --urban-fill: black;
            --urban-fill-o: 1;
            --urban-stroke: none;
            --urban-stroke-o: 1;
            --urban-stroke-w: none; */
        }
        #outline { fill: none; stroke: black; stroke-opacity: 0.3; }
        #ocean { fill: var(--ocean-fill); fill-opacity: var(--ocean-fill-o); stroke: none; }
        #graticule { fill: none; stroke: var(--grat-stroke); stroke-opacity: var(--grat-stroke-o); stroke-width: var(--grat-stroke-w); }
        #coastline { fill: none; stroke: var(--coastline-stroke); stroke-opacity: var(--coastline-stroke-o); stroke-width: var(--coastline-stroke-w); }
        #countries { fill: var(--pays-fill); fill-opacity: var(--pays-fill-o); stroke: none; }
        #borders { fill: none; stroke: var(--borders-stroke); stroke-opacity: var(--borders-stroke-o); stroke-width: var(--borders-stroke-w); }
        #hydro { fill: var(--hydro-stroke); stroke: var(--hydro-stroke); stroke-opacity: var(--hydro-stroke-o); stroke-width: var(--hydro-stroke-w); mix-blend-mode: multiply; }
        #relief { fill: var(--relief-fill); fill-opacity: var(--relief-fill-o); pointer-events: none; }
        #relief .levelRelief { filter: url(#reliefShadow); }
        #relief.ShadeColor .levelRelief { mix-blend-mode: multiply; }
        #rivers { fill: none; }
        #lakes { stroke: none; }
        #cities { fill: var(--cities-fill); fill-opacity: var(--cities-fill-o); stroke: var(--cities-stroke); stroke-opacity: var(--cities-stroke-o); stroke-width: var(--cities-stroke-w); }
        /* #urban { fill: var(--urban-fill); fill-opacity: var(--urban-fill-o); stroke: var(--urban-stroke); stroke-opacity: var(--urban-stroke-o); stroke-width: var(--urban-stroke-w); } */

        .countries.hover { fill: var(--accent-color-light); fill-opacity: 0.7; mix-blend-mode: multiply; }
    </style>
</svg>

<div id="zoom-button">
    <button on:click={zoomIn} use:tooltip title="Zoom avant"><span class="material-icons">add</span></button>
    <button on:click={zoomOut} use:tooltip title="Zoom arrière"><span class="material-icons">remove</span></button>
    <button on:click={zoomReset} use:tooltip={{content: $zResetMessage}}><span class="material-icons">refresh</span></button>
</div>



<style>
    #zoom-button {
        position: absolute;
        top: 2em;
        right: 2em;
        display: flex;
        flex-flow: column nowrap;
        gap: 2px;
    }
    #zoom-button button {
        border: none;
        box-shadow: 0 4px 4px rgb(0 0 0 / 20%);
        background-color: var(--light-grey);
        padding: .2rem;
        border-radius: .2rem;
    }
    #zoom-button button:hover {
        background-color: var(--accent-color-light);
        color: var(--accent-color);
        cursor: pointer;
    }

    #gScaleBar:hover { color: var(--accent-color); }
</style>