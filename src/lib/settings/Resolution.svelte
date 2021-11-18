<script>
    import Tip from './Tip.svelte'
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'

    //Tips message
    let m1 = "Simplifier (ou généraliser) les tracés permet de modifier le niveau de détails des objets. Cette fonction est par exemple utile pour adapter la carte à une certaine échelle."

    const res_list = {
        "Simplifié": "110m",
        "Normal": "50m",
        "Détaillé": "10m"
    }

    let res_selected = ["Normal"]
</script>

<section id="resolution" class="settings-section"
    use:inView 
    on:enter={() => stepEnter("headerResolution")}
>
    <h2><span class="material-icons">timeline</span> Simplifier</h2>
    <Tip message={m1} />
    <form id="res-select">
        <h3>Détail des tracés</h3>
        <ul>
            {#each Object.entries(res_list) as [name, value] }
                <li>
                    <label for={value}>{name}</label>
                    <input type="radio" bind:group={res_selected} id={value} {value} {name}>
                </li>
                
            {/each}
        </ul>
    </form>
    <a href="#download" class="next-section fontTitle">
        <p>continuer</p>
        <span class="material-icons">expand_more</span>
    </a>
</section>


<style>
    #res-select ul {
        list-style-type: none;
        padding: 0;
    }
    #res-select li {
        display: flex;
        justify-content: flex-end;
    }
    #res-select label {
        /* Taille du label */
        flex: 1;
        font-size: var(--text-medium);
    }
</style>