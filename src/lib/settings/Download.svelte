<script>
    import { proj, lyr, mapReady } from '../../stores.js'
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
    function serialize(svg) {
        const svgData = new XMLSerializer().serializeToString(svg)
        const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"})
        return svgBlob
    }

    // ----------------- PNG ----------------- //
    // d'après https://observablehq.com/@mbostock/saving-svg
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
    // d'après https://github.com/observablehq/stdlib/blob/main/src/dom/download.js
    // stock la taille et l'url du blob d'export svg et png
    let blobSVG = {},
        blobPNG = {}

    // param1: svg de la carte = appel de cleaningSVG()
    // param2: format de fichier (svg, png ou pdf)
    // param3: optionnel = si le téléchargement doit être enclenché ou non
    function downloadMap(svg, type, dl) {
        const a = select(`#download_${type}`).node()

        // reset blobURL, href et download attr
        async function reset() {
            // https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame
            await new Promise(requestAnimationFrame);
            URL.revokeObjectURL(a.href)
            a.removeAttribute("href")
            a.removeAttribute("download")
        }
        if (a.href) return reset()

        switch (type) {
            case 'svg': {
                const blob = serialize(svg)
                const url = URL.createObjectURL(blob)
                const size = (blob.size / 1024 / 1024).toFixed(1) // octet => Ko => Mo
                blobSVG = {size, url}
                if (dl) {
                    a.href = url
                    a.setAttribute("download", `basemap-${today}.svg`)
                    // Pas besoin, le téléchargement se lance déjà, pourquoi ?
                    // a.click()
                }
                break
            }
            case 'png': {
                SVGtoPNG(svg).then( //blob => blob)
                    blob => {
                        const url = URL.createObjectURL(blob)
                        const size = (blob.size / 1024).toFixed(0) // octet => Ko
                        blobPNG = {size, url}
                        if (dl) {
                            a.href = url
                            a.setAttribute("download", `basemap-${today}.png`)
                            a.click()
                        }
                    }
                )
                break
            }
            case 'pdf': {
                const blob = serialize(svg)
                const url = URL.createObjectURL(blob)
                printSVG(url)
                break
            }
        }
        reset()
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
    <a id="download_svg" on:click={ () => downloadMap(cleaningSVG(), 'svg', true) }>
        <button><span class="material-icons">download_for_offline</span> SVG ({blobSVG.size} Mo)</button>
    </a>

    <Tip message={m2} />
    <a id="download_png" on:click={ () => downloadMap(cleaningSVG(), 'png', true) }>
        <button><span class="material-icons">download_for_offline</span> PNG ({blobPNG.size} Ko)</button>
    </a>

    <Tip message={m3} />
    <a id="download_pdf" on:click={ () => downloadMap(cleaningSVG(), 'pdf', true) }>
        <button><span class="material-icons">print</span> Imprimer</button>
    </a>
</section>

<style>
    section#download a {
        margin-bottom: 1rem;
    }
    button {
        border: 1px solid var(--dark-grey);
        border-radius: 2em;
        padding: .3rem .7rem;
        background-color: var(--light-grey);
        /* box-shadow: 0 4px 4px rgb(0 0 0 / 20%); */
        /* color: var(--dark-grey); */
        /* padding: .2rem; */
    }
    button:hover {
        border: 1px solid var(--accent-color);
        background-color: var(--accent-color-light);
        color: var(--accent-color);
        cursor: pointer;
    }
</style>