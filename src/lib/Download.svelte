<script>
    import { onMount } from 'svelte'
    import { select } from 'd3-selection'

    let size

    // Voir le travail d'Arnaud
    // https://github.com/AtelierCartographie/Khartis/blob/master/app/utils/svg-exporter.js
    function cleaningSVG() {
        // supprime les couches masquées
        const svg = select('#map-svg').node().cloneNode(true)
        const d3svg = select(svg)
        d3svg.selectAll(".hidden").remove()

        // corrige le lien du clip-path
        d3svg.select('g#basemap').attr('clip-path', '#clip')

        // dégrouper g#zoom =>  puis les ré-inserts
        const zoomChildren = d3svg.select('g#zoom').selectChildren().remove().nodes()   // sélectionner tous les enfants
        d3svg.select('g#zoom').remove()                                                 // supprimer g#zoom
        zoomChildren.forEach( node => d3svg.append(() => node))                         // réinsérer les enfants
        
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

    const today = new Date().toLocaleString("fr", {
          "day": "numeric",
          "month": "numeric",
          "year": "numeric"
        })

    onMount( () => {
        downloadSVG()
    })
</script>

<a id="download_svg" download={`basemap-${today}.svg`} on:click={downloadSVG}>
    <button>Télécharger la carte au format svg (~ {size} Mo)</button>
</a>

<style>

</style>