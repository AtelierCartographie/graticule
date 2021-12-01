<script>
    import { regbbox, countrybbox } from '../../stores.js'
    import Tip from './Tip.svelte'
    import regionsBbox from '../../assets/regionsBbox.js'         //cadrage régionaux
    import countriesBbox from '../../assets/countriesBbox.json'   // cadrage nationaux
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'

    //Tips message
    let m1 = "Pour préciser un cadrage, choisir dans les listes ci-dessous ou bien naviguer directement dans la carte."

    let reg_selected = null,
        country_selected = null
    const countries = [null].concat(countriesBbox.features.sort( (a,b) => a.properties.name.localeCompare(b.properties.name) ))
    
    $: regbbox.set(regionsBbox.find( d => d.id === reg_selected).bbox)
    $: countrybbox.set(countries.find( d => d == null ? null : d.properties.id === country_selected))

    // Rendre exclusif les deux select
    function resetSelect(el) {
        const a = document.getElementById(el)
        const b = el == "input_regSelect" ? "input_countrySelect" : "input_regSelect"
        if (a.value != null) { 
            document.getElementById(b).value = null
            el == "input_regSelect" ? country_selected = null : reg_selected = null
        }
    }
    
</script>

<section id="frame" class="settings-section"
    use:inView 
    on:enter={() => stepEnter("headerFrame")}
>
    <h2><span class="material-icons">crop</span> Cadrer</h2>
    <Tip message={m1} />

    <!-- <label for="input_regSelect" class="fontTitle">Régions du monde</label> -->
    <h3>Régions du monde</h3>
    <select bind:value={reg_selected} on:change="{() => resetSelect("input_regSelect")}" name="regions" id="input_regSelect">
        {#each regionsBbox as d}
            <option value={d.id}>{d.name}</option>
        {/each}
    </select>

    <p><strong>ou</strong></p>

    <h3>Pays du monde</h3>
    <input list="countryList"
            id="input_countrySelect"
            name="country"
            bind:value={country_selected}
            on:change="{() => resetSelect("input_countrySelect")}" />
    <datalist id="countryList" name="countries" >
        {#each countries as d}
            {#if d == null}
            <option value={null}>-</option>
            {:else}
            <option value={d.properties.id}>{d.properties.name}</option>
            {/if}
        {/each}
    </datalist>

    <p><strong>ou</strong></p>
    
    <h3 id="freeFrame">Cadrage libre <span class="material-icons">east</span></h3>
</section>



<style>
    p { font-size: var(--text-medium); }
    #freeFrame > .material-icons { color: var(--dark-grey); }
    #freeFrame:hover > .material-icons { 
        animation-duration: .5s;
        animation-name: toTheRight;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }
    @keyframes toTheRight { to { transform: translate(50%,0); } }
</style>