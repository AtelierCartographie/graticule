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
    
    // z holds a copy of the previous transform, so we can track its changes
    let z = d3.zoomIdentity;

    // paramètres du pan and zoom
    const zoom2 = d3.zoom()
            .scaleExtent([0.5, 10]) // min, max du zoom
            .translateExtent([[0, 0], [width, height]]) // bornes extérieures du translate
            .on("zoom", zoomed)

    // pendant le pan and zoom
    function zoomed({transform}) {
        z = transform
        select("g#zoom").attr("transform", transform);
    }
    
    // ZOOM SUR UNE ZONE SPÉCIFIQUE
    function zoomRegion(b) {
        // sélectionne le groupe où s'applique le pan and zoom
        const g = d3.select(svgID).select("g#zoom") 

        // Récupère les coordonnées en pixel de la bbox d'un geosjon
        const [[x0, y0], [x1, y1]] = path.bounds(b)
        console.log(path.bounds(b))
        
        // console.log(`Inside: ${z}`)
        // console.log(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
        // console.log(width / 2, height / 2)
        // console.log(-(x0 + x1) / 2, -(y0 + y1) / 2)

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
        // console.log(z)
        console.log(d3.zoomTransform(g.node()))
        // résultat du zoom doit être réattribuer à z
    }
    // $: z = d3.select(svgID).select("g#zoom").node() !== null ? d3.zoomTransform(d3.select(svgID).select("g#zoom").node()) : z
    // $: console.log(z)
    // $: console.log(isReady ? d3.zoomTransform(d3.select(svgID).select("g#zoom").node()) : "not ready")

    // /!\ -- /!\ -- /!\
    // zoomTransform(node) est lié à l'event et donc au changement de l'utilisateur
    // quand le changement est programmatique zoomTransform(node) est inchangé
    // /!\ -- /!\ -- /!\

    // z renvoie {k, x, y} et besoin d'appliquer une translation
    // z contient aussi des méthodes/fonctions (scale, translate...)
    // ex résultat cadrage afrique {k: 2.6224254843119006, x: -451.1345912917234, y: -150.82646532191228}
    // bbox Afrique, [[215, 65], [319, 202]]

    $: if (isReady) { zoomRegion(bbox) }

    onMount( () => {
        isReady = true

        // sélectionne le groupe où s'applique le pan and zoom
        const g = d3.select(svgID).select("g#zoom")
        // z = d3.zoomTransform(g.node())

        // applique le zoom sur le groupe "g#zoom" plutôt que l'ensemble du svg
        // => limite le zoom à l'intérieur du cadrage (via d3-brush)
        g.call(zoom2);

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