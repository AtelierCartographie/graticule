<script>
    import Tip from './Tip.svelte'
    import Toggle from './Toggle.svelte'
    import { slide } from "svelte/transition"
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'
    import { resType, res } from '../../stores.js'

    //Tips message
    let m1 = "Par défaut le détail des tracés augmentent avec le niveau de zoom selon trois niveaux de simplification. Ce comportement dynamique peut être remplacé par un niveau de simplification fixé manuellement."

    const res_list = {
        "Simplifié": "110m",
        "Normal": "50m",
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
        {#each Object.entries(res_list) as [name, value] }
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