<script>
    import { lyr, gratType, gratStep } from '../../stores.js'
    import tooltip from '../../assets/tooltip.js'
    import { slide } from "svelte/transition";

    let step = 10
    $: gratStep.set(step)

    let type = 'top'
    $: gratType.set(type)
</script>

{#if $lyr.includes("graticule")}
    <div class="habillage-style" transition:slide={{ duration: 300 }}>
        <button on:click={() => gratType.set('top')}
                class:active="{ $gratType === 'top' }"
                use:tooltip={{ placement: 'top' }} 
                title="Lignes imaginaires essentielles" 
                type="button" 
                class="badge">
            essentiels
        </button>
        <button on:click={() => gratType.set('all')}
                class:active="{ $gratType === 'all' }"
                use:tooltip={{ placement: 'top' }} 
                title="Ensemble des méridiens et parallèles" 
                type="button" 
                class="badge">
            complet
        </button>

        {#if $gratType == 'all'}
            <!-- <label for="gratStep">Espacement</label> -->
            <!-- <input type="range" bind:value={step} id="gratStep" min="0" max="60" step="5"> -->
            <input use:tooltip={{ content: 'Espacement en degré', placement: 'top' }} 
                transition:slide={{ duration: 300 }}
                type="number"
                bind:value={step} 
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
    p { margin-bottom: 0; }
</style>