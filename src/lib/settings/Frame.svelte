<script>
    import { regbbox } from '../../stores.js'
    import Tip from './Tip.svelte'
    import reg_bbox from '../../assets/reg_bbox' // cadrage régionaux
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'

    //Tips message
    let m1 = "Pour préciser un cadrage, choisir dans les listes ci-dessous ou bien naviguer directement dans la carte."

    let reg_selected = 'world'
    $: regbbox.set(reg_bbox.find( d => d.id === reg_selected).bbox)
</script>

<section id="frame" class="settings-section"
    use:inView 
    on:enter={() => stepEnter("headerFrame")}
>
    <h2><span class="material-icons">crop</span> Cadrer</h2>
    <Tip message={m1} />
    <form id="reg-select">
        <label for="reg-select" class="fontTitle">Régions du monde</label>

        <select bind:value={reg_selected} name="projection" id="reg-select">
            {#each reg_bbox as d}
                <option value={d.id}>{d.name}</option>
            {/each}
        </select>
    </form>
    <a href="#projection" class="next-section">
        <p>continuer</p>
        <span class="material-icons">expand_more</span>
    </a>
</section>



<style>
    #reg-select label {
        font-size: var(--text-medium);
        font-weight: bold;
        color: var(--dark-grey);
    }
</style>