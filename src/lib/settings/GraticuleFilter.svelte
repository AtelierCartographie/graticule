<script>
    import { slide } from "svelte/transition"
    import { lyr, gratType, gratStep } from '../../stores.js'
    import tooltip from '../js/tooltip.js'
    import { isLyr } from '../js/isLyr.js'
    import Badge from '../UI/Badge.svelte'

    let isGrat
    $: { isGrat = isLyr('graticule') ; $lyr }
</script>

{#if isGrat}
    <div class="habillage-style" transition:slide={{ duration: 300 }}>
        <Badge onClick={() => $gratType = 'top'}
            classActive={$gratType === 'top'}
            title="Équateur, Tropiques, Cercles polaires, Greenwitch"
            text="Remarquables" />

        <Badge onClick={() => $gratType = 'all'}
            classActive={$gratType === 'all'}
            title="Grille à espacement régulier"
            text="Réguliers" />

        {#if $gratType == 'all'}
            <input use:tooltip={{ content: 'Espacement en degré', placement: 'top' }} 
                transition:slide={{ duration: 300 }}
                type="number"
                bind:value={$gratStep} 
                id="gratStep"
                min="0" max="60" step="5">
        {/if}
    </div>
{/if}