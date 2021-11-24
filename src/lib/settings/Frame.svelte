<script>
    import { regbbox, countrybbox } from '../../stores.js'
    import Tip from './Tip.svelte'
    import reg_bbox from '../../assets/reg_bbox' // cadrage régionaux
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'
    import { countries } from '../../assets/geo.js'

    //Tips message
    let m1 = "Pour préciser un cadrage, choisir dans les listes ci-dessous ou bien naviguer directement dans la carte."

    let reg_selected = null, country_selected = null
    $: regbbox.set(reg_bbox.find( d => d.id === reg_selected).bbox)
    $: countrybbox.set(countries.find( d => d.properties.id === country_selected))

    // Comment rendre les deux <select> exclusive
    // touché à un reset l'autre
    // $: if ($regbbox != null) { country_selected = null }
    // $: if ($countrybbox != null) { reg_selected = null }
    
</script>

<section id="frame" class="settings-section"
    use:inView 
    on:enter={() => stepEnter("headerFrame")}
>
    <h2><span class="material-icons">crop</span> Cadrer</h2>
    <Tip message={m1} />
    <form id="frame-select">
        <!-- <label for="input_regSelect" class="fontTitle">Régions du monde</label> -->
        <h3>Régions du monde</h3>
        <select bind:value={reg_selected} name="regions" id="input_regSelect">
            {#each reg_bbox as d}
                <option value={d.id}>{d.name}</option>
            {/each}
        </select>

        <!-- <label for="input_countrySelect" class="fontTitle">Pays du monde</label> -->
        <h3>Pays du monde</h3>
        <select bind:value={country_selected} name="countries" id="input_countrySelect">
            {#each [null].concat(countries) as d}
                {#if d == null}
                <option value={null}>-</option>
                {:else}
                <option value={d.properties.id}>{d.properties.name}</option>
                {/if}
            {/each}
        </select>
    </form>
</section>



<style>
    /* #frame-select label {
        font-size: var(--text-medium);
        font-weight: bold;
        color: var(--dark-grey);
    } */
    h3 {
        margin-bottom: 0;
    }
</style>