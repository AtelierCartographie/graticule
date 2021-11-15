<script>
    import { zTransform, proj, lyr, mapReady } from '../../stores.js'
    import { select } from 'd3-selection'
    import Tip from './Tip.svelte'
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'

    //Tips message
    let m1 = "SVG est un format vectoriel permettant l'édition et le changement de dimensions sans dégrader la résolution"
    let m2 = "PNG est un format matriciel qui ne peut être agrandi sans dégrader la résolution"
    let m3 = "Imprimer directement la carte ou sauvegarder là au format PDF"

    //
    const today = new Date().toLocaleString("fr", {
        "day": "numeric",
        "month": "numeric",
        "year": "numeric"
    })

    // ----------------- CLEANING ----------------- //
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

    // ----------------- SVG ----------------- //
    // stock la taille et l'url de l'export png
    let blobSVG = {}

    function serialize(svg) {
        const svgData = new XMLSerializer().serializeToString(svg)
        const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"})
        return svgBlob
    }

    // ----------------- PNG ----------------- //
    // d'après https://observablehq.com/@mbostock/saving-svg
    // stock la taille et l'url de l'export png
    let blobPNG = {}

    function SVGtoPNG(svg) {
        let resolve, reject;
        const promise = new Promise((y, n) => (resolve = y, reject = n))
            const image = new Image
            image.onerror = reject
            image.onload = () => {
                const rect = svg.viewBox.baseVal
                const canvas = document.createElement("canvas")
                canvas.width = rect.width
                canvas.height = rect.height
                canvas.style.width = rect.width + "px"
                const context = canvas.getContext("2d")
                context.drawImage(image, 0, 0, rect.width, rect.height)
                canvas.toBlob(resolve)
                }
            image.src = URL.createObjectURL(serialize(svg))

            return promise
    }

    // ----------------- PRINT ----------------- //
    // Impression à l'aide de l'utilitaire du navigateur
    function printSVG(url) {
        let win = window.open(url, '__blank')
        win.addEventListener('afterprint', event => event.target.close() )
        win.print()
    }

    // --------------- DOWNLOAD --------------- // 
    // idée de faire un download commun qui s'adapte selon les paramètres de la fonction
    // à la sortie SVG ou PNG
    // et MAJ le lien de <a>
    async function downloadMap(svg, type) {
        const a = select(`#download_${type}`).node()

        // reset href et URL
        if (a.href) {
            URL.revokeObjectURL(a.href)
            a.removeAttribute("href")
        } 
        switch (type) {
            case 'svg': {
                const blob = serialize(svg)
                const url = URL.createObjectURL(blob)
                const size = (blob.size / 1024 / 1024).toFixed(1) // octet => Ko => Mo
                blobSVG = {size, url}
                a.href = url
                break
            }
            case 'png': {
                const blob = await SVGtoPNG(svg).then( blob => blob)
                //     blob => {
                //         const url = URL.createObjectURL(blob)
                //         const size = (blob.size / 1024).toFixed(0) // octet => Ko
                //         blobPNG = {blob, size, url}
                //         // a.href = url
                //     }
                // )
                const url = URL.createObjectURL(blob)
                const size = (blob.size / 1024).toFixed(0) // octet => Ko
                blobPNG = {size, url}
                a.href = url
                break
            }
            case 'pdf': {
                const blob = serialize(svg)
                const url = URL.createObjectURL(blob)
                printSVG(url)
                break
            }
        }
    }

    // ----------------- FILE SIZE ----------------- //
    // Mettre à jour le blob à chaque changement de couches actives
    // pour afficher le bon poids de fichier dans les boutons de téléchargement
    $: if ($mapReady) {
        $proj
        $lyr
        downloadMap(cleaningSVG(), 'svg')
        downloadMap(cleaningSVG(), 'png')
    }  
</script>


<section id="download" class="settings-section"
    use:inView 
    on:enter={() => stepEnter("headerDownload")}
>
    <h2><span class="material-icons">download</span> Télécharger</h2>

    <Tip message={m1} />
    <a id="download_svg" download={`basemap-${today}.svg`} on:click={() => downloadMap(cleaningSVG(), 'svg')}>
        <button><span class="material-icons">download_for_offline</span> SVG ({blobSVG.size} Mo)</button>
    </a>

    <Tip message={m2} />
    <a id="download_png" download={`basemap-${today}.png`} on:click={() => downloadMap(cleaningSVG(), 'png')}>
        <button><span class="material-icons">download_for_offline</span> PNG ({blobPNG.size} Ko)</button>
    </a>

    <Tip message={m3} />
    <a id="download_pdf" on:click={() => downloadMap(cleaningSVG(), 'pdf')}>
        <button><span class="material-icons">print</span> Imprimer</button>
    </a>
</section>

<style>
    section#download a {
        margin-bottom: 1rem;
    }
</style>