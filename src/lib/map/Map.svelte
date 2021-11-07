<script>
    import { onMount } from 'svelte'
    import { proj } from '../../stores.js'
    import { geoPath } from 'd3-geo'
    import { select } from 'd3-selection'
    import { brush } from 'd3-brush'

    import Basemap from './Basemap.svelte'
    import Zoom from './Zoom.svelte'

    let width = 900, height = 600
    let projection
    const unsubscribe = proj.subscribe(value => { projection = value })

    $: path = geoPath(projection)

    let outline = ({type: "Sphere"})

    // d'après https://observablehq.com/@observablehq/d3-world-map
    // [[x0, y0], [x1, y1]]
    $: bbox = geoPath(projection.fitWidth(width, outline)).bounds(outline)
    // y1 - y0
    // $: height = Math.ceil(bbox[1][1] - bbox[0][1])


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

    onMount( () => {
        // initier le cadrage avec d3-brush
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
    })
    $: height
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
            <Zoom svgID="#map-svg" {width} {height} {path} >          
                <Basemap {path} {outline} />
            </Zoom>
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
        <button><span class="material-icons">add</span></button>
        <button><span class="material-icons">remove</span></button>
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