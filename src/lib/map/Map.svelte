<script>
    import { onMount } from 'svelte'
    import { proj, regbbox, countrybbox, zTransform, mapTheme, lyr, mapTitle, scaleDist, canAddScale, mapReady } from '../../stores.js'
    import { geoPath } from 'd3-geo'
    import { select } from 'd3-selection'
    import { brush } from 'd3-brush'
    import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom'
    import { drag } from 'd3-drag'
    import { geoScaleBar } from 'd3-geo-scale-bar'
    import Basemap from './Basemap.svelte'

    export let width, height // dimensions du svg

    // hauteur du cadrage de la carte = laisse de la place pour le titre et le crédit
    const mapMargin = (height * 0.05) / 2
    const mapHeight = height - mapMargin

    let mapCredit
    $: { mapCredit = $lyr.includes('urban') 
            ? "Sources : Natural Earth ; European Commission, JRC, GHS, 2019. Réalisé avec #Cartofond."
            : "Source : Natural Earth. Réalisé avec #Cartofond." }

    // --------------- PROJECTION -------------- //
    let outline = ({type: "Sphere"})
    $: path = geoPath($proj.fitExtent([[0, mapMargin], [width, mapHeight]], outline))
    // ---------------------------------------- //

    // ----------------- BRUSH ---------------- //
    let rx, ry, rw, rh
    function brushed( { selection: [[x0, y0], [x1, y1]] } ) {
        // passer les coordonnées du brush courant
        // au clip de cadrage => clipPath #clip-cadrage
        rx = x0 - 5
        ry = y0 - 5
        rw = x1 - x0 + 10
        rh = y1 - y0 + 10
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
    // ---------------------------------------- //

    // --------------- SCALE BAR -------------- //
    let scaleInitDist = 2000 // distance de l'échelle en km
    let k = 1                // stock le facteur de zoom
    let zx = 0, zy = 0       // stock le translate du zoom
    // centre du cadrage
    $: cx = rx + rw / 2
    $: cy = ry + rh / 2
    // centre du cadrage dans la carte avec le zoom
    $: zcx = (cx - zx) / k
    $: zcy = (cy - zy) / k
    // position de la légende
    $: left = zcx / width
    $: top = zcy / mapHeight
    
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
    // appliquer une seule fois !
    let i = true
    $: if ($canAddScale && i) {
        i = !i
        select("#gScaleBar")
            .attr("cursor", "move")
            .call(scaleBar.left(left).top(top))
            .call(dragScaleBar)
    }
    // Relancer l'échelle si...
    $: {
        // Taille et épaisseur constante en pompensant le zoom
        select("#gScaleBar .label").attr("font-size", 12 / k)
        select("#gScaleBar .domain").attr("stroke-width", 1.5 / k)

        // ... changement de projection
        if ($canAddScale) { select("#gScaleBar").call(scaleBar.projection($proj)) }

        // ... zoom (comportement dynamique par défaut sinon utilisateur fixe une distance)
        isNaN($scaleDist)
        ? select("#gScaleBar").call(scaleBar.distance(scaleInitDist / k)
                                            .label(`${Math.round(scaleBar.distance())} km`))
        : select("#gScaleBar").call(scaleBar.distance($scaleDist)
                                            .label(`${Math.round(scaleBar.distance())} km`))  
    }

    // Déplacer l'échelle graphique
    function dragged(event) {
        scaleBar.left(event.x / width).top(event.y / height) // passer des pixels du svg au 0-1 de scaleBar.left et .top
        select("#gScaleBar").attr("cursor", "grabbing").call(scaleBar)
    }
    const dragScaleBar = drag()
        .on("drag", dragged)
        .on("end", () => select("#gScaleBar").attr("cursor", "move")) // retour au curseur d'origine
    // ---------------------------------------- //

    // ----------------- ZOOM ----------------- //
    // Fix bug webkit: Wheel event is not fired on a SVG group element in Safari
    // https://stackoverflow.com/a/67925459
    select(document.body).on('wheel.body', e => {})

    let isReady = false
    let zmin = 0.5,
        zmax = 100,
        zCall = "#gCadrage",
        zApply = "#gZoom"

    // paramètres du pan and zoom
    const d3zoom = zoom()
            .scaleExtent([zmin, zmax]) // min, max du zoom
            .translateExtent([[0, mapMargin], [width, mapHeight]]) // bornes extérieures du translate
            .on("zoom", ({ transform }) => {
                select(zApply).attr("transform", transform).attr("cursor", "grabbing")
                // utiliser par scaleBar
                zTransform.set(transform)
                k = transform.k
                zx = transform.x
                zy = transform.y
            })
            .on("end", () => select(zApply).attr("cursor", "grab"))
    
    // ZOOM SUR UNE ZONE SPÉCIFIQUE
    function zoomRegion(b) {
        if (b != null) {
            // Récupère les coordonnées en pixel de la bbox d'un geosjon
            const [[x0, y0], [x1, y1]] = path.bounds(b)

            // Voir exemple : https://observablehq.com/@d3/zoom-to-bounding-box
            select(zCall).transition().duration(750).call(
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
    $: if (isReady) { 
        $proj
        zoomRegion($regbbox)
        zoomRegion($countrybbox)

        if ($regbbox == null) zoomReset() // = zoom monde si region null ou pays null
    }

    // Boutons de contrôle du zoom
    // voir https://observablehq.com/@d3/programmatic-zoom
    const zoomIn = () => select(zCall).transition().call(d3zoom.scaleBy, 1.5)
    const zoomOut = () => select(zCall).transition().call(d3zoom.scaleBy, 1/1.5)
    const zoomReset = () => $regbbox == null && $countrybbox == null
            ?  select(zCall).transition().duration(750).call(
                d3zoom.transform,
                zoomIdentity,
                zoomTransform(select(zCall).node()).invert([width / 2, mapHeight / 2]))
            : ( zoomRegion($regbbox), zoomRegion($countrybbox) )
    // ---------------------------------------- //

    onMount( () => {
        isReady = true
        mapReady.set(isReady)
        // BRUSH ----- initialise le cadrage avec d3-brush
        let gBrush = select('#gBrush')
        gBrush
            .call(Brush)
            .call(Brush.move, [[5, mapMargin + 5], [width-10, mapHeight-10]])
            
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
        // => évite les conflits d'event avec 
        select(zCall)
            .attr("cursor", "grab")
            .call(d3zoom)
    })
</script>

<svg id="mapSvg" class={$mapTheme}
    width="100%" height="100%" viewBox="0 0 {width} {height}" 
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <clipPath id="clip"><path d="{path(outline)}" /></clipPath>
        <clipPath id="clip-cadrage">
            <rect x={rx} y={ry} width={rw} height={rh} />
        </clipPath>
    </defs>

    {#if isReady}
    <text id="mapTitle" x={rx} y={ry} dy=-5>{$mapTitle}</text>
    <text id="mapCredit" x={rx + rw} y={ry + rh} dy=10>{mapCredit}</text>
    {/if}
    <g id="gCadrage" style="clip-path: url(#clip-cadrage)">
        <g id="gZoom" >        
            <Basemap {path} {outline} />
            <g id="gScaleBar" style="visibility: hidden"></g>
        </g>
    </g>
    
    <g id="gBrush">
        {#if isReady}
        <path id="cropTop" class="crop" transform={xyCropTop} d="M19,15l-1.41-1.41L13,18.17V2H11v16.17l-4.59-4.59L5,15l7,7L19,15z"/>
        <path id="cropRight" class="crop" transform={xyCropRight} d="M9,19l1.41-1.41L5.83,13H22V11H5.83l4.59-4.59L9,5l-7,7L9,19z"/>
        <path id="cropBottom" class="crop" transform={xyCropBottom} d="M5,9l1.41,1.41L11,5.83V22H13V5.83l4.59,4.59L19,9l-7-7L5,9z"/>
        <path id="cropLeft" class="crop" transform={xyCropLeft} d="M15,5l-1.41,1.41L18.17,11H2V13h16.17l-4.59,4.59L15,19l7-7L15,5z"/>
        {/if}
    </g>
        
    <style>
        #cadrage { fill: none; stroke: var(--accent-color); stroke-width: 2; stroke-dasharray: 0 6; stroke-linecap: round; transition-property: stroke, stroke-width, stroke-dasharray; transition-duration: .5s; }
        #cadrage.inView { stroke-width: 3; stroke-dasharray: none; }
        .crop { fill: var(--accent-color); opacity: 0; transition: opacity .5s; }
        #cadrage.inView ~ .crop { opacity: 1; }
        #mapSvg { background-color: white; }
        #mapTitle { font-size: 16px; font-weight: bold; font-family: "Fira Code", monospace; fill: var(--dark-grey); visibility: hidden; }
        #mapCredit { font-size: 12px; font-family: "Open sans", sans-serif; text-anchor: end; fill: var(--dark-grey); }

        #mapSvg.colorMode { 
            --ocean-fill: AliceBlue;
            --ocean-fill-o: 1;
            --ocean-stroke: #ccc;
            --ocean-stroke-o: 1;
            --ocean-stroke-w: 1;
            
            --grat-stroke: #ccc;
            --grat-stroke-o: 1;
            --grat-stroke-w: 0.5;

            --pays-fill: lightgrey;
            --pays-fill-o: 1;

            --borders-stroke: white;
            --borders-stroke-o: 1;
            --borders-stroke-w: 0.5;

            --hydro-stroke: CornflowerBlue;
            --hydro-stroke-o: 1;
            --hydro-stroke-w: 0.5;

            --urban-fill: black;
            --urban-fill-o: 1;
            --urban-stroke: none;
            --urban-stroke-o: 1;
            --urban-stroke-w: none;
        }
        #mapSvg.outlineMode { 
            --ocean-fill: white;
            --ocean-fill-o: 1;
            --ocean-stroke: #ccc;
            --ocean-stroke-o: 1;
            --ocean-stroke-w: 1;

            --grat-stroke: black;
            --grat-stroke-o: 1;
            --grat-stroke-w: 0.5;
            
            --pays-fill: white;
            --pays-fill-o: 1;

            --borders-stroke: black;
            --borders-stroke-o: 1;
            --borders-stroke-w: 0.5;

            --hydro-stroke: CornflowerBlue;
            --hydro-stroke-o: 1;
            --hydro-stroke-w: 0.5;

            --urban-fill: black;
            --urban-fill-o: 1;
            --urban-stroke: none;
            --urban-stroke-o: 1;
            --urban-stroke-w: none;
        }
        #ocean { fill: var(--ocean-fill); fill-opacity: var(--ocean-fill-o); stroke: var(--ocean-stroke); stroke-opacity: var(--ocean-stroke-o); stroke-width: var(--ocean-stroke-w); }
        #graticule { fill: none; stroke: var(--grat-stroke); stroke-opacity: var(--grat-stroke-o); stroke-width: var(--grat-stroke-w); }
        #countries { fill: var(--pays-fill); fill-opacity: var(--pays-fill-o); stroke: none; }
        #borders { fill: none; stroke: var(--borders-stroke); stroke-opacity: var(--borders-stroke-o); stroke-width: var(--borders-stroke-w); }
        #hydro { fill: var(--hydro-stroke); stroke: var(--hydro-stroke); stroke-opacity: var(--hydro-stroke-o); stroke-width: var(--hydro-stroke-w); }
        #rivers { fill: none; }
        #lakes { stroke: none; }
        #urban { fill: var(--urban-fill); fill-opacity: var(--urban-fill-o); stroke: var(--urban-stroke); stroke-opacity: var(--urban-stroke-o); stroke-width: var(--urban-stroke-w); }
    </style>
</svg>

<div id="zoom-button">
    <button on:click={zoomIn} title="Zoom avant"><span class="material-icons">add</span></button>
    <button on:click={zoomOut} title="Zoom arrière"><span class="material-icons">remove</span></button>
    <button on:click={zoomReset} title="Réinitialiser le zoom"><span class="material-icons">restart_alt</span></button>
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