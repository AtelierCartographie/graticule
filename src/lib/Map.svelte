<script>
    import { onMount } from 'svelte'
    import { geoPath } from 'd3-geo'
    import { select } from 'd3-selection'
    import { brush } from 'd3-brush'

    import Basemap from './Basemap.svelte'
    import Zoom from './Zoom.svelte'

    let width = 500, height = 500

    export let projection, geo

    $: path = geoPath(projection)

    let outline = ({type: "Sphere"})

    // d'après https://observablehq.com/@observablehq/d3-world-map
    // [[x0, y0], [x1, y1]]
    $: bbox = geoPath(projection.fitWidth(width, outline)).bounds(outline)
    // y1 - y0
    // $: height = Math.ceil(bbox[1][1] - bbox[0][1])

    let rx, ry, rw, rh

    function brushed({selection: [[x0, y0], [x1, y1]]}) {
        // passer les coordonnées du brush courant
        // au rectangle de cadrage => clipPath #clip-cadrage
        rx = x0
        ry = y0
        rw = x1 - x0
        rh = y1 - y0
    }

    let Brush = brush()
        .filter(event => !event.ctrlKey
          && !event.button
          && !select(event.target).classed("selection"))
        .handleSize(24)
        .on("brush", brushed)

    // $: height = document.getElementById("svg-container").clientHeight
    $: console.log(height)

    onMount( () => {
        // height = document.getElementById("svg-container").clientHeight
        // initier le cadrage avec d3-brush
        let gBrush = select('#gBrush')
        gBrush
            .call(Brush)
            .call(Brush.move, [[12, 12], [width-12, height-12]])
            
        gBrush.select(".overlay").remove() // empêche la création d'un nouveau brush
        gBrush.select(".selection")
            .attr("fill", "none")
            .attr("stroke", "none")
            .attr("cursor", "auto") // rétablit valeur par défaut
    })
</script>

<figure id="svg-container">

    {#if width}

        <svg id="map-svg" viewBox="0 0 {width} {height}" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <path id="outline" d="{path(outline)}" />
                <clipPath id="clip"><use xlink:href="#outline" /></clipPath>
                <clipPath id="clip-cadrage">
                    <rect x={rx} y={ry} width={rw} height={rh} />
                </clipPath>
            </defs>

            <g id="gBrush"></g>

            <g style="clip-path: url(#clip-cadrage)">
                <Zoom svgID="#map-svg" {width} {height} >
                    
                    <Basemap {path} {geo} {outline} />

                    <use xlink:href="#outline" id="outline" />

                </Zoom>
            </g>
            
            <rect id="cadrage" x={rx} y={ry} width={rw} height={rh} />
                
            <style>
                #map-svg { background-color: white; }
                #cadrage { fill: none; stroke: blue; }
                #outline { fill: none; stroke: #ccc; stroke-width: 0.5; }
                #ocean { fill: AliceBlue; stroke: none; }
                #graticule { fill: none; stroke: #ccc; stroke-width: 0.5; }
                #land { fill: lightgrey; stroke: none; }
                #borders { fill: none; stroke: white; stroke-width: 0.5; }
                #borders_disputed { fill: none; stroke: red; stroke-width: 0.5; }
                #urban { fill: black; stroke: none; }
            </style>
        </svg>

    {/if}

</figure>

<style>
    #svg-container {
        /* display: flex; */
        position: relative;
        margin-top: var(--nav-h);
        margin-left: calc(18rem + 2rem);
        /* width: 100%; */
        /* height: 100%;
        margin: 1rem; */
    }
</style>