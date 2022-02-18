<script>
    import { regSelect, countrySelect, regbbox, countrybbox, zResetMessage, callZoomReset } from '../../stores.js'
    import Tip from '../UI/Tip.svelte'
    import regionsBbox from '../../assets/regionsBbox.js'         // cadrage régionaux  
    import {countriesBbox} from '../../assets/countriesBbox.js'   // cadrage nationaux
    import inView from '../js/inView.js'
    import stepEnter from '../js/stepEnter.js'

    //Tips message
    let m1 = "Pour préciser un cadrage, choisir dans les listes ci-dessous ou bien naviguer directement dans la carte."

    let country = null // stocke la valeur de l'input pays
    // Conserve de l'input pays que les correspondances avec un ID de pays
    $: $countrySelect = 
        countriesBbox.find( d => d.id == country) == undefined
        ? null
        : country

    // Récupère les bbox de la région ou du pays sélectionné
    $: $regbbox = regionsBbox.find( d => d.id === $regSelect).bbox
    $: $countrybbox = countriesBbox.find( d => d.id === $countrySelect).bbox
    

    // Rends exclusif les deux select (région OU pays)
    function resetSelect(el) {
        const a = document.getElementById(el)
        const b = el == "input_regSelect" ? "input_countrySelect" : "input_regSelect"
        if (a.value != null) { 
            document.getElementById(b).value = null
            el == "input_regSelect" ? $countrySelect = null : $regSelect = null
        }
    }
    
    // Bouton à côté de l'input
    // Vide l'input sélectionné + cadrage carte = monde
    function clearSelect(el) {
        document.getElementById(el).value = null
        el == "input_regSelect" ? $regSelect = null : $countrySelect = null
        $callZoomReset = true
    }

    // Message du tooltip du bouton zoomReset de la carte
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
    <div>
        <input list="countryList"
            id="input_countrySelect"
            name="country"
            bind:value={country}
            on:change="{() => resetSelect("input_countrySelect")}" />
        <datalist id="countryList" name="countries" >
            {#each countriesBbox as d}
                <option value={d.id}>{d.name}</option>
            {/each}
        </datalist>
        <button on:click={() => clearSelect("input_countrySelect")}
                disabled={$countrySelect == null}>
            <span class="material-icons">clear</span>
        </button>   
    </div>
    
    <!-- <div>
        <select bind:value={$countrySelect} on:change="{() => resetSelect("input_countrySelect")}" name="countries" id="input_countrySelect">
            {#each countriesBbox as d}
                <option value={d.id}>{d.name}</option>
            {/each}
        </select>
        <button on:click={() => clearSelect("input_countrySelect")}
                disabled={$countrySelect == null}>
            <span class="material-icons">clear</span>
        </button>    
    </div> -->
    

    <p><strong>ou</strong></p>
    

    <h3 id="freeFrame">Cadrage personnalisé <span class="material-icons">east</span></h3>
</section>



<style>
    div {
        display: flex;
        flex-flow: row nowrap;
    }
    select, input { width: 100%;}

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