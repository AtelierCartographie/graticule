<script>
    import { zCat, proj, lyr, mapReady, downloadStep } from '../../stores.js'
    import { select } from 'd3-selection'
    import Tip from '../UI/Tip.svelte'
    import inView from '../js/inView.js'
    import stepEnter from '../js/stepEnter.js'

    //Tips message
    let m1 = "SVG est un format vectoriel permettant l'édition et le changement de dimensions sans dégrader la résolution"
    let m2 = "PNG est un format matriciel qui ne peut être agrandi sans dégrader la résolution"
    let m3 = "Imprimer directement la carte ou la sauvegarder au format PDF"

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
        const svg = select('#mapSvg').node().cloneNode(true)
        const d3svg = select(svg)
        d3svg.selectAll(".hidden").remove()

        // supprime le groupe d'interaction g#brush
        d3svg.selectAll("#gBrush").remove()

        // stock le zoom appliqué par l'utilisateur
        const zTransform = d3svg.select('#gZoom').attr('transform')
        
        // zoom transform + scale bar transform
        let zsTransform
        if (d3svg.select('#gScaleBar').size() != 0) { // si la scale bar est présente
            const sTransform = d3svg.select('#gScaleBar').attr('transform')
            zsTransform = (sTransform == null) 
                ? zTransform
                : zTransform + " " + sTransform
        }
        
        // dégrouper g#zoom =>  puis les ré-inserts dans g#gCadrage
        const zoomChildren = d3svg.select('#gZoom').selectChildren().remove().nodes()   // sélectionner tous les enfants
        d3svg.select('#gZoom').remove()                                                 // supprimer g#zoom
        zoomChildren.forEach( node => d3svg.select('#gCadrage').append(() => node))    // réinsérer les enfants
        // réappliquer les transformations sur les sous-groupes
        d3svg.select('#gBasemap').attr('transform', zTransform)                         // réapplique le zoom utilisateur
        d3svg.select('#gScaleBar').attr('transform', zsTransform)                       // applique le transform zoom + scaleBar
        
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
    function SVGtoPNG(svg, dpi) {
        if (dpi == null) dpi = devicePixelRatio;
        // Bug Firefox => remplace width, height par des valeurs en pixel
        // absence d'attribut ou pourcentage non supporté, https://stackoverflow.com/a/28692538
        select(svg)
            .attr('width', svg.viewBox.baseVal.width + "px")
            .attr('height', svg.viewBox.baseVal.height + "px")
        let resolve, reject;
        const promise = new Promise((y, n) => (resolve = y, reject = n))
        const image = new Image
        image.onerror = reject
        image.onload = () => {
            // get current size of the canvas
            const rect = svg.viewBox.baseVal
            const canvas = document.createElement("canvas")
            // increase the actual size of our canvas
            canvas.width = rect.width * dpi
            canvas.height = rect.height * dpi
            // scale everything down using CSS
            canvas.style.width = rect.width + "px"
            canvas.style.height = rect.height + "px"
            const context = canvas.getContext("2d")
            // ensure all drawing operations are scaled
            context.scale(dpi, dpi)
            context.drawImage(image, 0, 0, rect.width, rect.height)
            // canvas.toDataURL('image/png', 1).replace('image/png', 'image/octet-stream')
            canvas.toBlob(resolve)
            }
        let svgUrl = serialize(svg)
        image.src = URL.createObjectURL(svgUrl)
        URL.revokeObjectURL(svgUrl)
            
        return promise
    }

    // ----------------- PRINT ----------------- //
    // Impression à l'aide de l'utilitaire du navigateur
    function printSVG(url) {
        let win = window.open(url, '__blank')
        win.addEventListener('afterprint', event => event.target.close() )
        // add delay to fix bug in firefox
        setTimeout( () => win.print(), 50)
    }

    // --------------- DOWNLOAD --------------- //
    // d'après https://github.com/observablehq/stdlib/blob/main/src/dom/download.js
    // stock la taille et l'url du blob d'export svg et png
    let blobSVG = {},
        blobPNG = {}
    // param1: svg de la carte = appel de cleaningSVG()
    // param2: format de fichier (svg, png ou pdf)
    // param3: (optionnel) si le téléchargement doit être enclenché ou non
    function downloadMap(svg, type, dl) {
        const a = document.createElement("a");
        let url // stocke l'url du blob
        
        // reset blobURL, href et download attributes
        async function reset() {
            // https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame
            await new Promise(requestAnimationFrame);
            URL.revokeObjectURL(url)
            a.removeAttribute("href")
            a.removeAttribute("download")
        }
        if (a.href) return reset()

        switch (type) {
            case 'svg': {
                const blob = serialize(svg)
                url = URL.createObjectURL(blob)
                const size = (blob.size / 1024 / 1024).toFixed(1) // octet => Ko => Mo
                blobSVG = {size, url}

                if (dl) {
                    a.href = url
                    a.setAttribute("download", `basemap-${today}.svg`)
                    a.click()
                }
                break
            }
            case 'png': {
                SVGtoPNG(svg, 4).then( //blob => blob)
                    blob => {
                        url = URL.createObjectURL(blob)
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
    // À l'ouverture de l'étape Télécharger
    // calculer le poids des fichiers exportables
    // $: if ($downloadStep) {
    //     $zCat
    //     downloadMap(cleaningSVG(), 'svg')
    //     downloadMap(cleaningSVG(), 'png')
    // }
</script>


<section id="download" class="settings-section"
    use:inView 
    on:enter={() => { stepEnter("headerDownload"); $downloadStep = true }}
 	on:exit={() => $downloadStep = false}
>
    <h2><span class="material-icons">download</span> Télécharger</h2>

    <Tip message={m1} />
    <button type="button" on:click={ () => downloadMap(cleaningSVG(), 'svg', true) }>
        <span class="material-icons">download_for_offline</span> SVG
    </button>

    <Tip message={m2} />
    <button type="button" on:click={ () => downloadMap(cleaningSVG(), 'png', true) }>
        <span class="material-icons">download_for_offline</span> PNG
    </button>

    <Tip message={m3} />
    <button type="button" on:click={ () => downloadMap(cleaningSVG(), 'pdf', true) }>
        <span class="material-icons">print</span> Imprimer
    </button>
</section>

<style>
    button {
        width: fit-content;
        border: 1px solid var(--dark-grey);
        border-radius: 2em;
        padding: .3rem .7rem;
        margin-bottom: 1rem;
        background-color: var(--light-grey);
        
    }
    button:hover {
        border: 1px solid var(--accent-color);
        background-color: var(--accent-color-light);
        color: var(--accent-color);
        cursor: pointer;
    }
</style>