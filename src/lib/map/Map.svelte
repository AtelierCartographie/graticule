<script>
    import { onMount } from 'svelte'
    import { proj, regbbox, zTransform, lyr, mapTitle, scaleDist, canAddScale, mapReady } from '../../stores.js'
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
        select("g#scaleBar")
            .attr("cursor", "move")
            .call(scaleBar.left(left).top(top))
            .call(dragScaleBar)
    }
    // Relancer l'échelle si...
    $: {
        // Taille et épaisseur constante en pompensant le zoom
        select("g#scaleBar .label").attr("font-size", 12 / k)
        select("g#scaleBar .domain").attr("stroke-width", 1.5 / k)

        // ... changement de projection
        if ($canAddScale) { select("g#scaleBar").call(scaleBar.projection($proj)) }

        // ... zoom (comportement dynamique par défaut sinon utilisateur fixe une distance)
        isNaN($scaleDist)
        ? select("g#scaleBar").call(scaleBar.distance(scaleInitDist / k)
                                            .label(`${Math.round(scaleBar.distance())} km`))
        : select("g#scaleBar").call(scaleBar.distance($scaleDist)
                                            .label(`${Math.round(scaleBar.distance())} km`))  
    }

    // Déplacer l'échelle graphique
    function dragged(event) {
        scaleBar.left(event.x / width).top(event.y / height) // passer des pixels du svg au 0-1 de scaleBar.left et .top
        select("g#scaleBar").attr("cursor", "grabbing").call(scaleBar)
    }
    const dragScaleBar = drag()
        .on("drag", dragged)
        .on("end", () => select("g#scaleBar").attr("cursor", "move")) // retour au curseur d'origine
    // ---------------------------------------- //

    // ----------------- ZOOM ----------------- //
    let isReady = false

    // paramètres du pan and zoom
    const zoom2 = zoom()
            .scaleExtent([0.5, 15]) // min, max du zoom
            .translateExtent([[0, mapMargin], [width, mapHeight]]) // bornes extérieures du translate
            .on("zoom", ({ transform }) => {
                select("g#zoom").attr("transform", transform).attr("cursor", "grabbing")
                // utiliser par scaleBar
                zTransform.set(transform)
                k = transform.k
                zx = transform.x
                zy = transform.y
            })
            .on("end", () => select("g#zoom").attr("cursor", "grab"))
    
    // ZOOM SUR UNE ZONE SPÉCIFIQUE
    function zoomRegion(b) {
        if (b != null) {
            // Récupère les coordonnées en pixel de la bbox d'un geosjon
            const [[x0, y0], [x1, y1]] = path.bounds(b)

            // Voir exemple : https://observablehq.com/@d3/zoom-to-bounding-box
            select("g#zoom").transition().duration(750).call(
                zoom2.transform,
                zoomIdentity
                    .translate(width / 2, mapHeight / 2)
                    .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / mapHeight)))
                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
            ) 
        }
    }

    $: if (isReady) { 
        $proj
        zoomRegion($regbbox) }

    // Boutons de contrôle du zoom
    // voir https://observablehq.com/@d3/programmatic-zoom
    const zoomIn = () => select("g#zoom").transition().call(zoom2.scaleBy, 1.5)
    const zoomOut = () => select("g#zoom").transition().call(zoom2.scaleBy, 1/1.5)
    const zoomReset = () => select("g#zoom").transition().duration(750).call(
        zoom2.transform,
        zoomIdentity,
        zoomTransform(select("g#zoom").node()).invert([width / 2, mapHeight / 2]))
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
            .attr("fill", "none")
            .attr("stroke", "none")
            .attr("cursor", "auto")         // rétablit valeur par défaut
            .attr("pointer-events", "none") // ne bloque/cache pas les events en dessous (ici le zoom)

        // ZOOM ----- applique le zoom sur "g#zoom" plutôt que l'ensemble du svg
        // => limite le zoom à l'intérieur du cadrage (via d3-brush)
        select("g#zoom")
            .attr("cursor", "grab")
            .call(zoom2)
    })
</script>

<svg id="map-svg" width="100%" height="100%" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
        <g id="zoom" >        
            <Basemap {path} {outline} />
            <g id="scaleBar" style="visibility: hidden"></g>
        </g>
    </g>
    
    <g id="gBrush"></g>
        
    <style>
        #map-svg { background-color: white; }
        #cadrage { fill: none; stroke: var(--accent-color); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 0 6; }
        #ocean { fill: AliceBlue; stroke: #ccc; stroke-width: 1; }
        #graticule { fill: none; stroke: #ccc; stroke-width: 0.5; }
        #land { fill: lightgrey; stroke: none; }
        #borders { fill: none; stroke: white; stroke-width: 0.5; }
        #borders_disputed { fill: none; stroke: red; stroke-width: 0.5; }
        #urban { fill: black; stroke: none; }
        #mapTitle { font-size: var(--text-big); font-family: "Fira Code", monospace; fill: var(--dark-grey); visibility: hidden; }
        #mapCredit { font-size: var(--text-small); font-family: "Open sans", sans-serif; text-anchor: end; fill: var(--dark-grey); }
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

    #scaleBar:hover { color: var(--accent-color); }
</style>