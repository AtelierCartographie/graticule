<script>
    import { regSelect, countrySelect, regbbox, countrybbox } from '../../stores.js'
    import Tip from './Tip.svelte'
    import regionsBbox from '../../assets/regionsBbox.js'         //cadrage régionaux  
    import {countriesBbox} from '../../assets/countriesBbox.js'   // cadrage nationaux
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'

    //Tips message
    let m1 = "Pour préciser un cadrage, choisir dans les listes ci-dessous ou bien naviguer directement dans la carte."


    $: regbbox.set(regionsBbox.find( d => d.id === $regSelect).bbox)
    $: countrybbox.set(countriesBbox.find( d => d.id === $countrySelect).bbox)

    // Rendre exclusif les deux select
    function resetSelect(el) {
        const a = document.getElementById(el)
        const b = el == "input_regSelect" ? "input_countrySelect" : "input_regSelect"
        if (a.value != null) { 
            document.getElementById(b).value = null
            el == "input_regSelect" ? $countrySelect = null : $regSelect = null
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
    <select bind:value={$regSelect} on:change="{() => resetSelect("input_regSelect")}" name="regions" id="input_regSelect">
        {#each regionsBbox as d}
            <option value={d.id}>{d.name}</option>
        {/each}
    </select>

    <p><strong>ou</strong></p>

    <h3>Pays du monde</h3>
    <!-- <input list="countryList"
            id="input_countrySelect"
            name="country"
            bind:value={$countrySelect}
            on:change="{() => resetSelect("input_countrySelect")}" />
    <datalist id="countryList" name="countries" >
        {#each countriesBbox as d}
            <option value={d.id}>{d.name}</option>
        {/each}
    </datalist> -->
    <select bind:value={$countrySelect} on:change="{() => resetSelect("input_countrySelect")}" name="countries" id="input_countrySelect">
        {#each countriesBbox as d}
            <option value={d.id}>{d.name}</option>
        {/each}
    </select>

    <p><strong>ou</strong></p>
    
    <h3 id="freeFrame">Cadrage libre <span class="material-icons">east</span></h3>
</section>



<style>
    p { 
        font-size: var(--text-medium);
        margin-bottom: 0;
    }
    #freeFrame > .material-icons { color: var(--dark-grey); }
    #freeFrame:hover > .material-icons { 
        animation-duration: .5s;
        animation-name: toTheRight;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }
    @keyframes toTheRight { to { transform: translate(50%,0); } }
</style>