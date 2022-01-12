<script>
    import { slide } from "svelte/transition"
    import { lyr, reliefColor, reliefShowLevels, reliefLevels  } from '../../stores.js'
    import tooltip from '../../assets/tooltip.js'
    import { isLyr } from '../../assets/isLyr.js'

    let isRelief
    $: { isRelief = isLyr('relief') ; $lyr }
</script>

{#if isRelief}
    <div class="habillage-style" transition:slide={{ duration: 300 }}>
        <button on:click={() => reliefColor.set(!$reliefColor)}
                class:active="{ $reliefColor }"
                use:tooltip={{ placement: 'top' }} 
                title="Ajouter une intensité de couleurs à l'ombrage" 
                type="button" 
                class="badge">
            Couleurs
        </button>

        <button on:click={() => $reliefShowLevels = !$reliefShowLevels}
                class:active="{ $reliefShowLevels }"
                use:tooltip={{ placement: 'top' }} 
                title="Changer les seuils d'altitude (en m)" 
                type="button" 
                class="badge">
            Seuils personnalisés
        </button>

        {#if $reliefShowLevels}
        <input use:tooltip={{ content: 'Valeurs entières séparées par des virgules', placement: 'top' }} 
            transition:slide={{ duration: 300 }}
            type="text"
            bind:value={$reliefLevels} 
            id="reliefLevels">
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
    input { margin-top: .5rem; width: 100%; }

</style>