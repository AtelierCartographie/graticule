<script>
    import { slide } from "svelte/transition"
    import { lyr, gratType, gratStep } from '../../stores.js'
    import tooltip from '../../assets/tooltip.js'
    import isLyr from '../../assets/isLyr.js'

    $: isGrat = isLyr('graticule', $lyr)
</script>

{#if isGrat}
    <div class="habillage-style" transition:slide={{ duration: 300 }}>
        <button on:click={() => $gratType = 'top'}
                class:active="{ $gratType === 'top' }"
                use:tooltip={{ placement: 'top' }} 
                title="Équateur, Tropiques, Cercles polaires, Greenwitch" 
                type="button" 
                class="badge">
            Remarquables
        </button>

        <button on:click={() => $gratType = 'all'}
                class:active="{ $gratType === 'all' }"
                use:tooltip={{ placement: 'top' }} 
                title="Grille à espacement régulier" 
                type="button" 
                class="badge">
            Réguliés
        </button>
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



<style>
    .badge {
        display: inline-block;
        /* min-zwidth: 1em; */
        padding: .3rem .7rem;
        border-radius: 2em;
        font-size: var(--text-small);
        text-align: center;
        background: var(--light-grey);
        color: var(--dark-grey);
        border: 1px solid var(--dark-grey);
    }
    .badge.active, .badge:hover {
        background: var(--accent-color-light);
        color: var(--accent-color);
        border: 1px solid var(--accent-color);
    }
</style>