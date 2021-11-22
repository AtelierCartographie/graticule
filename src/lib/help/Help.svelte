<script>
    import { marked } from 'marked'
    import { modalContent } from '../../stores.js'
    
    // Import markdown file
    //https://vitejs.dev/guide/assets.html#importing-asset-as-string
    import helpProj from './helpProjection.md?raw'
    import helpScale from './helpScalBar.md?raw'

    
    // Changer pour un switch si plus de page d'aide
    $: markdown = $modalContent == 'proj' ? helpProj : helpScale

    $: html = marked.parse(markdown)
</script>

{@html html}