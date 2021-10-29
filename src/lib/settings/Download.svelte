<script>
    import { onMount } from 'svelte'
    import { select } from 'd3-selection'
    import Tip from './Tip.svelte'

    //Tips message
    let m1 = "SVG est un format vectoriel permettant l'édition et le changement de dimensions sans dégrader la résolution"

    //
    const today = new Date().toLocaleString("fr", {
        "day": "numeric",
        "month": "numeric",
        "year": "numeric"
    })

    let size

    // Voir le travail d'Arnaud
    // https://github.com/AtelierCartographie/Khartis/blob/master/app/utils/svg-exporter.js
    function cleaningSVG() {
        // supprime les couches masquées
        const svg = select('#map-svg').node().cloneNode(true)
        const d3svg = select(svg)
        d3svg.selectAll(".hidden").remove()

        // supprime le groupe d'interaction g#brush
        d3svg.selectAll("#gBrush").remove()

        // stock le zoom appliqué par l'utilisateur
        let transform = d3svg.select('g#zoom').attr('transform')

        // dégrouper g#zoom =>  puis les ré-inserts dans g#gCadrage
        const zoomChildren = d3svg.select('g#zoom').selectChildren().remove().nodes()   // sélectionner tous les enfants
        d3svg.select('g#zoom').remove()                                                 // supprimer g#zoom
        zoomChildren.forEach( node => d3svg.select('g#gCadrage').append(() => node))    // réinsérer les enfants
        d3svg.select('g#basemap').attr('transform', transform)                          // réapplique le zoom utilisateur
        
        return svg
    }

    function downloadSVG() {
        // ToDo, dégrouper les enfants de g#zoom
        const svgHtml = cleaningSVG()
        const svgData = new XMLSerializer().serializeToString(svgHtml)
        const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"})
        const svgUrl = URL.createObjectURL(svgBlob)
        select('#download_svg').attr('href', svgUrl)
        return size = (svgBlob.size / 1024 / 1024).toFixed(0) // octet => Ko => Mo
    }

    // https://observablehq.com/@mbostock/saving-svg
    // https://ramblings.mcpher.com/gassnippets2/converting-svg-to-png-with-javascript/
    function downloadPNG() {

    }

    // Comment rendre dynamique la préparation du téléchargement pour connaitre la taille du fichier ?
    // à chaque changement de selected layers ?
    onMount( () => {
        downloadSVG()
    })
</script>

<section id="download" class="settings-section">
    <h2><span class="material-icons">download</span> Télécharger</h2>
    <Tip message={m1} />
    <a id="download_svg" download={`basemap-${today}.svg`} on:click={downloadSVG}>
        <button>Télécharger la carte au format svg (~ {size} Mo)</button>
    </a>
</section>


<style>

</style>