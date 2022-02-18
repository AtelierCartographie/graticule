<script>
    import { slide } from "svelte/transition"
    import { lyr, reliefColor, reliefShowLevels, reliefLevels  } from '../../stores.js'
    import tooltip from '../js/tooltip.js'
    import { isLyr } from '../js/isLyr.js'
    import Badge from '../UI/Badge.svelte'

    let isRelief
    $: { isRelief = isLyr('relief') ; $lyr }
</script>

{#if isRelief}
    <div class="habillage-style" transition:slide={{ duration: 300 }}>
        <Badge onClick={() => $reliefColor = !$reliefColor}
            classActive={$reliefColor}
            title="Ajouter une intensité de couleurs à l'ombrage"
            text="Couleurs" />

        <Badge onClick={() => $reliefShowLevels = !$reliefShowLevels}
            classActive={$reliefShowLevels}
            title="Changer les seuils d'altitude (en m)"
            text="Seuils personnalisés" />

        {#if $reliefShowLevels}
        <input use:tooltip={{ content: 'Valeurs entières séparées par des virgules', placement: 'top' }} 
            transition:slide={{ duration: 300 }}
            type="text"
            bind:value={ $reliefLevels } 
            id="reliefLevels">
        {/if}
    </div>
{/if}


<style>
    input { margin-top: .5rem; width: 100%; }
</style>