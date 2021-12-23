<script>
    import { regSelect, countrySelect, regbbox, countrybbox, zResetMessage, callZoomReset } from '../../stores.js'
    import Tip from './Tip.svelte'
    import regionsBbox from '../../assets/regionsBbox.js'         //cadrage régionaux  
    import {countriesBbox} from '../../assets/countriesBbox.js'   // cadrage nationaux
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'
import { listen } from 'svelte/internal';

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
    
    function clearSelect(el) {
        document.getElementById(el).value = null
        el == "input_regSelect" ? $regSelect = null : $countrySelect = null
        $callZoomReset = true
    }

    // Tooltip message du bouton zoomReset de la carte
    const frameName = (list,value) => list.find(d => d.id == value).name
    $: $zResetMessage = 
        $regSelect != null
            ? `Revenir au cadrage "${frameName(regionsBbox, $regSelect)}"`
        : $countrySelect != null
            ? `Revenir au cadrage "${frameName(countriesBbox, $countrySelect)}"`
            : `Revenir au cadrage "monde"`
</script>

<section id="frame" class="settings-section"
    use:inView 
    on:enter={() => stepEnter("headerFrame")}
>
    <h2><span class="material-icons">crop</span> Cadrer</h2>
    <Tip message={m1} />

    <!-- <label for="input_regSelect" class="fontTitle">Régions du monde</label> -->
    <h3>Régions du monde</h3>
    <div>
        <select bind:value={$regSelect} on:change="{() => resetSelect("input_regSelect")}" name="regions" id="input_regSelect">
            {#each regionsBbox as d}
                <option value={d.id}>{d.name}</option>
            {/each}
        </select>
        <button on:click={() => clearSelect("input_regSelect")}
                disabled={$regSelect == null}>
            <span class="material-icons">clear</span>
        </button>    
    </div>
    

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
    <div>
        <select bind:value={$countrySelect} on:change="{() => resetSelect("input_countrySelect")}" name="countries" id="input_countrySelect">
            {#each countriesBbox as d}
                <option value={d.id}>{d.name}</option>
            {/each}
        </select>
        <button on:click={() => clearSelect("input_countrySelect")}
                disabled={$countrySelect == null}>
            <span class="material-icons">clear</span>
        </button>    
    </div>
    
    <p><strong>ou</strong></p>
    
    <h3 id="freeFrame">Cadrage personnalisé <span class="material-icons">east</span></h3>
</section>



<style>
    div {
        display: flex;
        flex-flow: row nowrap;
    }
    select { width: 100%;}

    p { 
        font-size: var(--text-medium);
        margin-bottom: 0;
    }
    
    button {
        background-color: transparent;
        border: 0;
        color: var(--dark-grey);
    }
    button:hover { color: var(--accent-color); }
    button:disabled { color: var(--grey); }

    #freeFrame > .material-icons { color: var(--dark-grey); }
    #freeFrame:hover > .material-icons { 
        animation-duration: .5s;
        animation-name: toTheRight;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }
    @keyframes toTheRight { to { transform: translate(50%,0); } }
</style>