<script>
    import { onMount } from 'svelte'
    import { regbbox } from '../../stores.js'

    import { zoom, zoomIdentity } from 'd3-zoom'
    import { select } from 'd3-selection'
    import { transition } from 'd3-transition'

    export let svgID, width, height, path

    let d3 = { zoom, zoomIdentity, select, transition }

    let bbox
    const unsubscribe = regbbox.subscribe(d => { bbox = d })
    
    // pendant le pan and zoom
    function zoomed(event) {
        const {transform} = event;
        select("g#zoom").attr("transform", transform);
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

    onMount( () => {
        // sélectionne le groupe où s'applique le pan and zoom
        const g = d3.select(svgID).select("g#zoom") 

        // paramètres du pan and zoom
        const zoom2 = d3.zoom()
            .scaleExtent([0.5, 10]) // min, max du zoom
            // .scaleTo(4)
            .translateExtent([[0, 0], [width, height]]) // bornes extérieures du translate
            .on("zoom", zoomed)

        // applique le zoom sur le groupe "g#zoom" plutôt que l'ensemble du svg
        // => limite le zoom à l'intérieur du cadrage (via d3-brush)
        g.call(zoom2).call(zoom2);

    })
        
</script>

<g id="zoom" >
    <slot></slot>
</g>