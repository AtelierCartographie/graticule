<script>
    import { lyr, zColor } from '../../stores.js'
    import tooltip from '../../assets/tooltip.js'
    import { slide } from "svelte/transition";
</script>

{#if $lyr.includes("relief")}
    <div class="habillage-style" transition:slide={{ duration: 300 }}>
            <button on:click={() => zColor.set(!$zColor)}
                    class:active="{ $zColor === true }"
                    use:tooltip={{ placement: 'top' }} 
                    title="Ajouté une intensité de couleurs à l'ombrage" 
                    type="button" 
                    class="badge">
                Couleurs
            </button>
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