<script>
    // Exemple simplifié avec un seul composant : https://svelte.dev/repl/ee4070a850944f92b0127ce5cebf0120?version=3.43.1
    import { projName, proj, isModalOpen, modalContent, projSettings } from '../../stores.js'
    import Tip from './Tip.svelte'
    import proj_list from '../../assets/proj_list.js'
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'
    import tooltip from '../../assets/tooltip.js'

    // Paramètres des projections : par défaut selon 'proj_list' puis dynamique via les input
    // Vérifier si valeurs dans le localStorage (LS) différente des valeurs par défaut
    const fromLS = (v, proj) => {
        const storage = $projSettings[v]
        const projDefault = proj_list.find( d => d.name === proj)[v]

        if (projDefault == undefined) {
            return undefined
        } else {
            return storage != projDefault && storage != undefined
            ? storage
            : projDefault
        }
    }

    $: $projSettings = {lambda, phi, gamma, parallel, distance, tilt, clipAngle}

    $: lambda = fromLS('lambda', $projName)
    $: phi = fromLS('phi', $projName)
    $: gamma = fromLS('gamma', $projName)
    $: parallel = fromLS('parallel', $projName)
    $: distance = fromLS('distance', $projName)
    $: tilt = fromLS('tilt', $projName)
    $: clipAngle = Math.acos( 1 / distance ) * 180 / Math.PI

    
    $: {
        let p = proj_list.find( d => d.name === $projName).fn.rotate([lambda, phi, gamma])
        if (parallel || parallel == 0) p.parallel([parallel])
        if (distance) p.distance([distance]).tilt([tilt]).clipAngle([clipAngle])
        proj.set(p)
    }

    // Tips message
    let m1 = "Pour préciser un cadrage, choisir dans les listes ci-dessous ou bien naviguer directement dans la carte."
    let m2 = "Choisir parmi la liste de projection et régler si besoin les paramètres."
</script>

<section id="projection" class="settings-section" 
    use:inView
    on:enter={() => stepEnter("headerProjection")}
>
    <h2><span class="material-icons">language</span> Projeter</h2>
    <Tip message={m2} />

    <label for="input_projSelect" class="fontTitle">
        Sélectionner une projection
        <span 
        use:tooltip title="Cliquer pour en savoir plus"
        on:click={() => modalContent.set('proj')}
        on:click={isModalOpen.set(!$isModalOpen)}
        class="material-icons tooltip">help_outline</span>
    </label>

    

    <select bind:value={$projName} name="projection" id="input_projSelect">
        <optgroup label="Incontournables">
            {#each proj_list.filter(d => d.top == true) as d}
                <option value={d.name}>{d.name}</option>
            {/each}
        </optgroup>
        <optgroup label="Autres">
            {#each proj_list.filter(d => d.top == false) as d}
                <option value={d.name}>{d.name}</option>
            {/each}
        </optgroup>
    </select>
    


    <h3>Paramétrage de la projection</h3>
    <ul>
        <li>
            <label for="lon">Longitude</label>
            <input type="range" bind:value={lambda} id="lon" min="-180" max="180" step="1" disabled={isNaN(lambda) || $projName == "Bertin 1953"}>
            <input type="number" bind:value={lambda} id="lon" min="-180" max="180" step="1" disabled={isNaN(lambda) || $projName == "Bertin 1953"}>
        </li>
        <li>
            <label for="lat">Latitude</label>
            <input type="range" bind:value={phi} id="lat" min="-90" max="90" step="1" disabled={isNaN(phi) || $projName == "Bertin 1953"}>
            <input type="number" bind:value={phi} id="lat" min="-90" max="90" step="1" disabled={isNaN(phi) || $projName == "Bertin 1953"}>
        </li>
        <li>
            <label for="rot">Rotation</label>
            <input type="range" bind:value={gamma} id="rot" min="-180" max="180" step="1" disabled={isNaN(gamma) || $projName == "Bertin 1953"}>
            <input type="number" bind:value={gamma} id="rot" min="-180" max="180" step="1" disabled={isNaN(gamma) || $projName == "Bertin 1953"}>
        </li>

        {#if parallel || parallel == 0}
        <li>
            <label for="parallel">Parallèle</label>
            <input type="range" bind:value={parallel} id="parallel" min="-90" max="90" step="1" >
            <input type="number" bind:value={parallel} id="parallel" min="-90" max="90" step="1" >
        </li>
        {/if}
        
        {#if distance}
        <li>
            <label for="alt">Altitude en km</label>
            <input type="range" bind:value={distance} id="alt" min="1" max="16" step="0.1" >
            <input type="number" bind:value={distance} id="alt" min="1" max="16" step="0.1" >
        </li>
        <li>
            <label for="tilt">Inclinaison en degré</label>
            <input type="range" bind:value={tilt} id="tilt" min="0" max="90" step="1" >
            <input type="number" bind:value={tilt} id="tilt" min="0" max="90" step="1" >
        </li>
        {/if}
    </ul>
</section>



<style>
    label.fontTitle {
        font-size: var(--text-medium);
        font-weight: bold;
        color: var(--dark-grey);
        margin-bottom: .5rem;
    }
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    li {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        gap: 1ch;
    }
    li label {
        /* Taille du label */
        flex: 1;
        font-size: var(--text-medium);
    }
    input[type="range"] { width: 8rem; }
    input[type="number"] { width: 2rem; font-size: var(--text-small); }
</style>