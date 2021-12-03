<script>
    import Tip from './Tip.svelte'
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'
    import { resType, res } from '../../stores.js'

    //Tips message
    let m1 = "Simplifier (ou généraliser) les tracés permet de modifier le niveau de détails des objets. Cette fonction est par exemple utile pour adapter la carte à une certaine échelle."

    const res_type = {
        "Dynamique": "dynamic",
        "Constant": "constant"
    }

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
    <h3>Type de simplification</h3>
    <ul>
        {#each Object.entries(res_type) as [name, value] }
        <li>
            <label for={value}>{name}</label>
            <input type="radio" bind:group={$resType} id={value} {value} {name}>
        </li>
        {/each}
    </ul>
    

    <h3>Détail des tracés</h3>
    <ul>
        {#each Object.entries(res_list) as [name, value] }
            <li>
                <label for={value}>{name}</label>
                <input type="radio" bind:group={$res} id={value} {value} {name} disabled={$resType == 'dynamic'}>
            </li> 
        {/each}
    </ul>
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