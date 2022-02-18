<script>
    import Tip from '../UI/Tip.svelte'
    import Toggle from '../UI/Toggle.svelte'
    import { slide } from "svelte/transition"
    import inView from '../js/inView.js'
    import stepEnter from '../js/stepEnter.js'
    import { resType, res } from '../../stores.js'

    //Tips message
    let m1 = "Le détail des tracés se précise automatiquement selon le niveau de zoom. À petite échelle, les tracés sont simplifiés, à grande échelle les tracés sont détaillés. Pour choisir un niveau de détail, activer la simplification manuelle ci-dessous."

    // Changement de résolution dynamique par défaut ($resType == 'dynamic')
    // si $resType == 'constant', l'utilisateur choisi parmi les trois options
    const resList = {
        "Très simplifié": "110m",
        "Simplifié": "50m",
        "Détaillé": "10m"
    }
</script>

<section id="resolution" class="settings-section"
    use:inView 
    on:enter={() => stepEnter("headerResolution")}
>
    <h2><span class="material-icons">timeline</span> Simplifier</h2>
    <Tip message={m1} />

    <Toggle label="Simplification manuelle" id="resToggle" name="Constant" value="constant" bind:bindGroup={$resType} />
    
    {#if $resType.includes('constant')}
    <h3 transition:slide={{ duration: 300 }}>Détail des tracés</h3>
    <ul>
        {#each Object.entries(resList) as [name, value] }
            <li transition:slide={{ duration: 300 }}>
                <label for={value}>{name}</label>
                <input type="radio" bind:group={$res} id={value} {value} {name}>
            </li> 
        {/each}
    </ul>
    {/if}
</section>


<style>
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    li {
        display: flex;
        justify-content: flex-end;
    }
    label {
        /* Taille du label */
        flex: 1;
        font-size: var(--text-medium);
    }
</style>