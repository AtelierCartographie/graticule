<script>
    import { onMount } from 'svelte'

    import { proj } from '../../stores.js'
    import { regbbox } from '../../stores.js'

    import { geoPath } from 'd3-geo'
    import { select } from 'd3-selection'
    import { brush } from 'd3-brush'
    import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom'
    import { drag } from 'd3-drag'
    import { geoScaleBar } from 'd3-geo-scale-bar'

    import Basemap from './Basemap.svelte'

    let width = 900, height = 600
    let projection
    const unsubscribeProj = proj.subscribe(value => { projection = value })

    $: path = geoPath(projection)

    let outline = ({type: "Sphere"})

    // d'après https://observablehq.com/@observablehq/d3-world-map
    // [[x0, y0], [x1, y1]]
    $: bbox = geoPath(projection.fitWidth(width, outline)).bounds(outline)
    // y1 - y0
    // $: height = Math.ceil(bbox[1][1] - bbox[0][1])


    // --------------- SCALE BAR -------------- //
    let k = 1 // stocke le facteur de zoom
    let dist = 2000 // distance de l'échelle en km
    const scaleBar = geoScaleBar()
        .projection(projection)
        .size([width, height])
        .left(.5)
        .top(.5)
        .radius(6371.0088)
        .distance(dist / k)
        .labelAnchor("middle")
        .tickSize(null)
        .tickValues(null)
        .zoomFactor(k)

    $: { 
        select("g#scaleBar").call(scaleBar.distance(dist / k)
                                          .label(`${Math.round(scaleBar.distance())} km`))
        select("g#scaleBar .label").attr("font-size", 12 / k)
        select("g#scaleBar .domain").attr("stroke-width", 1.5 / k)
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

    // ----------------- ZOOM ----------------- //
    let regBbox
    const unsubscribeRegbbox = regbbox.subscribe(d => { regBbox = d })

    let isReady = false

    // paramètres du pan and zoom
    const zoom2 = zoom()
            .scaleExtent([0.5, 10]) // min, max du zoom
            .translateExtent([[0, 0], [width, height]]) // bornes extérieures du translate
            .on("zoom", ({ transform }) => {
                select("g#zoom").attr("transform", transform).attr("cursor", "grabbing")
                k = transform.k // utiliser par scaleBar
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
                    .translate(width / 2, height / 2)
                    .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
            ) 
        }
    }

    $: if (isReady) { zoomRegion(regBbox) }

    // Boutons de contrôle du zoom
    // voir https://observablehq.com/@d3/programmatic-zoom
    const zoomIn = () => select("g#zoom").transition().call(zoom2.scaleBy, 1.5)
    const zoomOut = () => select("g#zoom").transition().call(zoom2.scaleBy, 1/1.5)
    const zoomReset = () => select("g#zoom").transition().duration(750).call(
        zoom2.transform,
        zoomIdentity,
        zoomTransform(select("g#zoom").node()).invert([width / 2, height / 2]))
    // ---------------------------------------- //

    onMount( () => {
        isReady = true

        // BRUSH ----- initialise le cadrage avec d3-brush
        let gBrush = select('#gBrush')
        gBrush
            .call(Brush)
            .call(Brush.move, [[5, 5], [width-10, height-10]])
            
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

        // SCALE BAR ----- initialise l'échelle graphique
        select("g#scaleBar")
            .attr("cursor", "move")
            .call(scaleBar)
            .call(dragScaleBar)
    })
</script>

<figure id="svg-container">

    <svg id="map-svg" width="100%" height="100%" viewBox="0 0 {width} {height}" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
            <clipPath id="clip"><path d="{path(outline)}" /></clipPath>
            <clipPath id="clip-cadrage">
                <rect x={rx} y={ry} width={rw} height={rh} />
            </clipPath>
        </defs>

        <g id="gCadrage" style="clip-path: url(#clip-cadrage)">
            <g id="zoom" >        
                <Basemap {path} {outline} />
                <g id="scaleBar"></g>
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
        </style>
    </svg>

    <div id="zoom-button">
        <button on:click={zoomIn} title="Zoom avant"><span class="material-icons">add</span></button>
        <button on:click={zoomOut} title="Zoom arrière"><span class="material-icons">remove</span></button>
        <button on:click={zoomReset} title="Réinitialiser le zoom"><span class="material-icons">restart_alt</span></button>
    </div>
</figure>



<style>
    #svg-container {
        all: inherit;
        display: block;
        position: relative;
        flex: 1;
        padding: 1rem;
        height: calc(var(--content-h) - 2rem);
    }
    
    /* g#zoom {
        cursor: grab;
    } */

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
</style>