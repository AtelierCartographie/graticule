<script>
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

    // stock la taille et l'url de l'export svg en blob
    let blobInfo = {}

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
        const svgHtml = cleaningSVG()
        const svgData = new XMLSerializer().serializeToString(svgHtml)
        const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"})
        const svgUrl = URL.createObjectURL(svgBlob)
        const size = (svgBlob.size / 1024 / 1024).toFixed(0) // octet => Ko => Mo
        return blobInfo = {size, url: svgUrl}
    }

    // https://observablehq.com/@mbostock/saving-svg
    // https://ramblings.mcpher.com/gassnippets2/converting-svg-to-png-with-javascript/
    function downloadPNG() {

    }

    function printSVG(url) {
        let win = window.open(url, '__blank')
        win.addEventListener('afterprint', event => event.target.close() )
        win.print()
    }
    
    // Comment rendre dynamique la préparation du téléchargement pour connaitre la taille du fichier ?
    // à chaque changement de selected layers ? car 'onMount' ne suffit pas
</script>

<section id="download" class="settings-section">
    <h2><span class="material-icons">download</span> Télécharger</h2>
    <Tip message={m1} />
    <a id="download_svg" download={`basemap-${today}.svg`} href={blobInfo.url} on:click={downloadSVG}>
        <button><span class="material-icons">download_for_offline</span> Télécharger (svg)</button>
    </a>

    <a id="print_svg" on:click={downloadSVG} on:click={printSVG(blobInfo.url)}>
        <button><span class="material-icons">print</span> Imprimer</button>
    </a>
</section>


<style>
    section#download a {
        margin-bottom: 1rem;
    }
</style>