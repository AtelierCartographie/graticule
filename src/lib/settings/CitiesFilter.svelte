<script>
    import { slide } from "svelte/transition";
    import { lyr, citiesCap } from '../../stores.js'
    import tooltip from '../../assets/tooltip.js'
    import isLyr from '../../assets/isLyr.js'

    $: isCities = isLyr('cities', $lyr)
</script>

{#if isCities}
    <div class="habillage-style" transition:slide={{ duration: 300 }}>
        <button on:click={() => $citiesCap = !$citiesCap}
                class:active="{ $citiesCap === true }"
                type="button" 
                class="badge">
            Capitales
        </button>
        <!-- <button on:click={() => urbanSize.set(50000)}
                class:active="{ $urbanSize === 50000 }"
                use:tooltip={{ placement: 'top' }} 
                title="> 50 000 hab." 
                type="button" 
                class="badge">
            50k
        </button>
        <button on:click={() => urbanSize.set(100000)}
                class:active="{ $urbanSize === 100000 }"
                use:tooltip={{ placement: 'top' }} 
                title="> 100 000 hab."
                type="button"
                class="badge">
            100k
        </button>
        <button on:click={() => urbanSize.set(250000)}
                class:active="{ $urbanSize === 250000 }"
                use:tooltip={{ placement: 'top' }}
                title="> 250 000 hab." 
                type="button"
                class="badge">
            250k
        </button>
        <button on:click={() => urbanSize.set(500000)}
                class:active="{ $urbanSize === 500000 }"
                use:tooltip={{ placement: 'top' }}
                title="> 500 000 hab." 
                type="button"
                class="badge">
            500k
        </button> -->
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