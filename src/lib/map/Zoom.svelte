<script>
    import { regbbox } from '../../stores.js'

    import { zoom, zoomIdentity } from 'd3-zoom'
    import { select } from 'd3-selection'
    import { transition } from 'd3-transition'

    export let svgID, width, height, path

    let d3 = { zoom, zoomIdentity, select, transition }

    let bbox
    const unsubscribe = regbbox.subscribe(d => { bbox = d })
    
    
    // TODO : faire fonctionner sans conflit 'add_zoom' et 'zoomRegion'
    // éviter les répétitions
    function addZoom() {
        // sélectionne le groupe où s'applique le pan and zoom
            const g = d3.select(svgID).select("g#zoom") 

        // paramètres du pan and zoom
        const zoom2 = d3.zoom()
            .scaleExtent([0.5, 10]) // min, max du zoom
            .translateExtent([[0, 0], [width, height]]) // bornes extérieures du translate
            .on("zoom", zoomed)


        // pendant le pan and zoom
        function zoomed(event) {
            const {transform} = event;
            g.attr("transform", transform);
        }

        d3.select(svgID).call(zoom2);
    }

    // ZOOM SUR UNE ZONE SPÉCIFIQUE
    function zoomRegion(b) {
        // sélectionne le groupe où s'applique le pan and zoom
            const g = d3.select(svgID).select("g#zoom") 

        // paramètres du pan and zoom
        const zoom2 = d3.zoom()
            .scaleExtent([0.5, 10]) // min, max du zoom
            .translateExtent([[0, 0], [width, height]]) // bornes extérieures du translate
            .on("zoom", zoomed)


        // pendant le pan and zoom
        function zoomed(event) {
            const {transform} = event;
            g.attr("transform", transform);
        }

        // Récupère les coordonnées en pixel de la bbox d'un geosjon
        const [[x0, y0], [x1, y1]] = path.bounds(b)

        if (b) {
            // Voir exemple : https://observablehq.com/@d3/zoom-to-bounding-box
            const t = d3.transition().duration(750).call(
                zoom2.transform, 
                d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
            )
            g.transition(t)
        }
    }
    $: zoomRegion(bbox)
        
</script>

<g id="zoom" on:wheel={addZoom}>
    <slot></slot>
</g>