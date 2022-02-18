<script>
    import { marked } from 'marked'
    import { modalContent } from '../../stores.js'
    
    // Import markdown file
    //https://vitejs.dev/guide/assets.html#importing-asset-as-string
    import helpProj from '../../assets/helpProjection.md?raw'
    import helpScale from '../../assets/helpScalBar.md?raw'
    import helpScreenSize from '../../assets/helpScreenSize.md?raw'
    import helpAbout from '../../assets/helpAbout.md?raw'

    let markdown
    $: { switch ($modalContent) {
            case 'proj':
                markdown = helpProj
                break
            case 'scale':
                markdown = helpScale
                break
            case 'size':
                markdown = helpScreenSize
                break
            case 'about':
                markdown = helpAbout
                break
        }
    }

    $: html = marked.parse(markdown)
</script>

{@html html}