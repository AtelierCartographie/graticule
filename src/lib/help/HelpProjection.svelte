<script>
    import fs from 'fs';
    import path from 'path';
    import { marked } from 'marked'

    let markdown = fs.readFileSync('./helpProjection.md', 'utf-8')
    let html = marked.parse(markdown)

</script>

{@html markdown}