<script>
    import { regbbox } from '../../stores.js'

    import { zoom, zoomIdentity } from 'd3-zoom'
    import { select } from 'd3-selection'
    import { transition } from 'd3-transition'

    export let svgID, width, height, path

    let d3 = { zoom, zoomIdentity, select, transition }

    let bbox
    const unsubscribe = regbbox.subscribe(d => { bbox = d })
    

    function add_zoom() {
        // sélectionne le groupe où s'applique le pan and zoom
        const g = d3.select(svgID).select("g#zoom") 

        // paramètres du pan and zoom
        const zoom = d3.zoom()
            .scaleExtent([1, 10]) // min, max du zoom
            .translateExtent([[0, 0], [width, height]]) // bornes extérieures du translate
            .on("zoom", zoomed)

        d3.select(svgID).call(zoom);

        // pendant le pan and zoom
        function zoomed(event) {
            const {transform} = event;
            g.attr("transform", transform);
        }

        // ZOOM SUR UNE ZONE SPÉCIFIQUE
        // Récupère les coordonnées en pixel de la bbox d'un geosjon
        const [[x0, y0], [x1, y1]] = path.bounds(bbox)

        if (bbox) {
            // Voir exemple : https://observablehq.com/@d3/zoom-to-bounding-box
            const t = d3.transition().duration(750).call(
                zoom.transform, 
                d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
            )
            g.transition(t)
        }
    }
</script>

<g id="zoom" on:wheel={add_zoom}>
    <slot></slot>
</g>