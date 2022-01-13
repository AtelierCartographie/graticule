<script>
    // Exemple simplifié avec un seul composant : https://svelte.dev/repl/ee4070a850944f92b0127ce5cebf0120?version=3.43.1
    import { projName, proj, projSettings, isModalOpen, modalContent } from '../../stores.js'
    import Tip from './Tip.svelte'
    import projList from '../../assets/projList.js'
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'
    import tooltip from '../../assets/tooltip.js'

    // Tips message
    let m1 = "Choisir parmi la liste de projections et régler si besoin les paramètres."


    // Paramètres des projections : par défaut selon 'projList' puis dynamique via les input
    // Vérifier si valeurs dans le localStorage (LS) différente des valeurs par défaut
    const fromLS = (v) => {
        const storage = $projSettings[v]
        const projDefault = projList.find( d => d.name === $projName)[v]

        if (projDefault == undefined) return undefined
        if (storage == undefined) return projDefault
        return (storage != projDefault && onLoad) ? storage : projDefault
    }

    const setProjSettings = () => {
        lambda = fromLS('lambda')
        phi = fromLS('phi')
        gamma = fromLS('gamma')
        parallel = fromLS('parallel')
        distance = fromLS('distance')
        tilt = fromLS('tilt')
    }

    let onLoad = true, projOnLoad
    let lambda, phi, gamma, parallel, distance, tilt, clipAngle
    // Au chargement : préférence sessionStorage sur paramètres par défaut
    $: if (onLoad) {
        setProjSettings()
        onLoad = false
        projOnLoad = $projName
    }

    // Au changement de projection : préférence paramètres par défaut
    $: if (!onLoad && projOnLoad != $projName) {
        setProjSettings()
        projOnLoad = '' // reset
    }

    // Cas de la projection satellite
    // Conversion de la distance en km vers distance depuis centre de la terre, https://github.com/d3/d3-geo-projection#satellite_distance
    $: distanceD3 = (distance + 6371) / 6371
    // clipAngle dynamique selon la distance
    $: clipAngle = Math.acos( 1 / distanceD3 ) * 180 / Math.PI

    // Stockage en sessionStorage des paramètres de projection
    $: $projSettings = {lambda, phi, gamma, parallel, distance, tilt, clipAngle}
    
    // Ajouts des paramètres à la projection d3
    $: {
        let p = projList.find( d => d.name === $projName).fn.rotate([lambda, phi, gamma])
        if (parallel || parallel == 0) p.parallel([parallel])
        if (distance) p.distance([distanceD3]).tilt([tilt]).clipAngle([clipAngle])
        $proj = p
    }

    // Projection non paramétrable : input disabled
    const projInputDisabled = ['Bertin 1953', 'Fuller (Airocean']
</script>

<section id="projection" class="settings-section" 
    use:inView
    on:enter={() => stepEnter("headerProjection")}
>
    <h2><span class="material-icons">language</span> Projeter</h2>
    <Tip message={m1} />

    <label for="input_projSelect" class="fontTitle">
        Projections
        <span 
        use:tooltip title="Cliquer pour en savoir plus"
        on:click={() => modalContent.set('proj')}
        on:click={isModalOpen.set(!$isModalOpen)}
        class="material-icons tooltip">help_outline</span>
    </label>

    

    <select bind:value={$projName} name="projection" id="input_projSelect">
        <optgroup label="Incontournables">
            {#each projList.filter(d => d.top == true) as d}
                <option value={d.name}>{d.name}</option>
            {/each}
        </optgroup>
        <optgroup label="Autres">
            {#each projList.filter(d => d.top == false) as d}
                <option value={d.name}>{d.name}</option>
            {/each}
        </optgroup>
    </select>
    


    <h3>Paramètres</h3>
    <ul>
        <li>
            <label for="lon">Longitude</label>
            <input type="range" bind:value={lambda} id="lon" min="-180" max="180" step="1" disabled={isNaN(lambda) || projInputDisabled.includes($projName)}>
            <input type="number" bind:value={lambda} id="lon" min="-180" max="180" step="1" disabled={isNaN(lambda) || projInputDisabled.includes($projName)}>
        </li>
        <li>
            <label for="lat">Latitude</label>
            <input type="range" bind:value={phi} id="lat" min="-90" max="90" step="1" disabled={isNaN(phi) || projInputDisabled.includes($projName)}>
            <input type="number" bind:value={phi} id="lat" min="-90" max="90" step="1" disabled={isNaN(phi) || projInputDisabled.includes($projName)}>
        </li>
        <li>
            <label for="rot">Rotation</label>
            <input type="range" bind:value={gamma} id="rot" min="-180" max="180" step="1" disabled={isNaN(gamma) || projInputDisabled.includes($projName)}>
            <input type="number" bind:value={gamma} id="rot" min="-180" max="180" step="1" disabled={isNaN(gamma) || projInputDisabled.includes($projName)}>
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
            <input type="range" bind:value={distance} id="alt" min="10" max="40000" step="100" >
            <input type="number" bind:value={distance} id="alt" min="10" max="40000" step="100" >
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