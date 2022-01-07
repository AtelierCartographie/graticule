<script>
    import { slide } from "svelte/transition";
    import { lyr, citiesType } from '../../stores.js'
    import tooltip from '../../assets/tooltip.js'
    import isLyr from '../../assets/isLyr.js'

    $: isCities = isLyr('cities', $lyr)
</script>

{#if isCities}
    <div class="habillage-style" transition:slide={{ duration: 300 }}>
        <button on:click={() => $citiesType = 'cap'}
                class:active="{ $citiesType === 'cap' }"
                type="button" 
                class="badge">
            Capitales
        </button>
        <button on:click={() => $citiesType = '>100k'}
                class:active="{ $citiesType === '>100k' }"
                use:tooltip={{ placement: 'top' }} 
                title="> 100 000 hab."
                type="button"
                class="badge">
            100k
        </button>
        <button on:click={() => $citiesType = '>250k'}
                class:active="{ $citiesType === '>250k' }"
                use:tooltip={{ placement: 'top' }}
                title="> 250 000 hab." 
                type="button"
                class="badge">
            250k
        </button>
        <button on:click={() => $citiesType = '>500k'}
                class:active="{ $citiesType === '>500k' }"
                use:tooltip={{ placement: 'top' }}
                title="> 500 000 hab." 
                type="button"
                class="badge">
            500k
        </button>
    </div>
{/if}


<style>
    .badge {
        display: inline-block;
        /* min-zwidth: 1em; */
        padding: .3rem .5rem;
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