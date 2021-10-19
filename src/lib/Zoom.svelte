<script>
    import { zoom } from 'd3-zoom'
    import { select } from 'd3-selection'

    export let svgID
    export let width, height

    let d3 = { zoom, select }


    function add_zoom() {    
        // paramètres du pan and zoom
        const zoom = d3.zoom()
            .scaleExtent([1, 10]) // min, max du zoom
            .translateExtent([[0, 0], [width, height]]) // bornes extérieures du translate
            .on("zoom", zoomed)

        d3.select(svgID).call(zoom);

        // pendant le pan and zoom
        function zoomed(event) {
            const {transform} = event;
            const g = d3.select(svgID).select("g#zoom") // sélectionne le groupe où s'applique le pan and zoom

            g.attr("transform", transform);
        }
    }
</script>

<g id="zoom" on:wheel={add_zoom}>
    <slot></slot>
</g>