<script>
    import { onMount } from 'svelte'
    import { regbbox } from '../../stores.js'

    import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom'
    import { select } from 'd3-selection'
    import { transition } from 'd3-transition'

    export let svgID, width, height, path

    let d3 = { zoom, zoomIdentity, zoomTransform, select, transition }

    let bbox
    const unsubscribe = regbbox.subscribe(d => { bbox = d })

    let isReady = false

    // paramètres du pan and zoom
    const zoom2 = d3.zoom()
            .scaleExtent([0.5, 10]) // min, max du zoom
            .translateExtent([[0, 0], [width, height]]) // bornes extérieures du translate
            .on("zoom", ({ transform }) => select("g#zoom").attr("transform", transform))

    
    // ZOOM SUR UNE ZONE SPÉCIFIQUE
    function zoomRegion(b) {
        if (b != null) {
            // Récupère les coordonnées en pixel de la bbox d'un geosjon
            const [[x0, y0], [x1, y1]] = path.bounds(b)

            // Voir exemple : https://observablehq.com/@d3/zoom-to-bounding-box
            d3.select("g#zoom").transition().duration(750).call(
                zoom2.transform,
                d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
            ) 
        }
    }

    $: if (isReady) { zoomRegion(bbox) }

    onMount( () => {
        isReady = true

        // applique le zoom sur le groupe "g#zoom" plutôt que l'ensemble du svg
        // => limite le zoom à l'intérieur du cadrage (via d3-brush)
        d3.select("g#zoom").call(zoom2);
    })
        
</script>

<g id="zoom" >
    <slot></slot>
</g>

<style>
    g#zoom {
        cursor: grab;
    }
</style>