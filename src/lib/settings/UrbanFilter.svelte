<script>
    import { slide } from "svelte/transition";
    import { lyr, urbanSize } from '../../stores.js'
    import { isLyr } from '../js/isLyr.js'
    import Badge from '../UI/Badge.svelte'

    let isUrban
    $: { isUrban = isLyr('urban') ; $lyr }

</script>

{#if isUrban}
    <div class="habillage-style" transition:slide={{ duration: 300 }}>
        <Badge onClick={() => $urbanSize = 50000}
            classActive={$urbanSize === 50000}
            title="> 50 000 hab."
            text="50k" />

        <Badge onClick={() => $urbanSize = 100000}
            classActive={$urbanSize === 100000}
            title="> 100 000 hab."
            text="100k" />

        <Badge onClick={() => $urbanSize = 250000}
            classActive={$urbanSize === 250000}
            title="> 250 000 hab."
            text="250k" />

        <Badge onClick={() => $urbanSize = 500000}
            classActive={$urbanSize === 500000}
            title="> 500 000 hab."
            text="500k" />
    </div>
{/if}