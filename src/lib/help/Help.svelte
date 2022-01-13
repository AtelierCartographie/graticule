<script>
    import { marked } from 'marked'
    import { modalContent } from '../../stores.js'
    
    // Import markdown file
    //https://vitejs.dev/guide/assets.html#importing-asset-as-string
    import helpProj from './helpProjection.md?raw'
    import helpScale from './helpScalBar.md?raw'
    import helpScreenSize from './helpScreenSize.md?raw'

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
        }
    }

    $: html = marked.parse(markdown)
</script>

{@html html}