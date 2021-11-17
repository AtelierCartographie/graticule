<script>
    import { marked } from 'marked'
    
    //https://vitejs.dev/guide/assets.html#importing-asset-as-string
    import markdown from './helpProjection.md?raw'

    let html = marked.parse(markdown)
</script>

{@html html}