<script>
    import { slide } from "svelte/transition";
    import { lyr, citiesType } from '../../stores.js'
    import { isLyr } from '../../assets/isLyr.js'
    import Badge from '../UI/Badge.svelte'

    let isCities
    $: { isCities = isLyr('cities') ; $lyr }
</script>

{#if isCities}
    <div class="habillage-style" transition:slide={{ duration: 300 }}>
        <Badge onClick={() => $citiesType = 'cap'}
            classActive={$citiesType === 'cap'}
            text="Capitales"
            isTooltip={false} />

        <Badge onClick={() => $citiesType = '>100k'}
            classActive={$citiesType === '>100k'}
            title="> 100 000 hab."
            text="100k" />

        <Badge onClick={() => $citiesType = '>250k'}
            classActive={$citiesType === '>250k'}
            title="> 250 000 hab."
            text="250k" />

        <Badge onClick={() => $citiesType = '>500k'}
            classActive={$citiesType === '>500k'}
            title="> 500 000 hab."
            text="500k" />
    </div>
{/if}