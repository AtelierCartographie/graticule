<script>
    // Exemple simplifié avec un seul composant : https://svelte.dev/repl/ee4070a850944f92b0127ce5cebf0120?version=3.43.1
    import { projID, proj, projSettings, isModalOpen, modalContent } from '../../stores.js'
    import Tip from './Tip.svelte'
    import { projParams, projListSort } from '../../assets/projList.js'
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'
    import tooltip from '../../assets/tooltip.js'

    // Tips message
    let m1 = "Choisir parmi la liste de projections et régler si besoin les paramètres."


    // Paramètres des projections : par défaut selon 'projList' puis dynamique via les input
    // Vérifier si valeurs dans la sessionStorage (SS) différente des valeurs par défaut
    const fromSS = (v) => {
        const storage = $projSettings[v]
        const projDefault = projParams.find( d => d.id === $projID)[v]

        if (projDefault == undefined) return undefined
        if (storage == undefined) return projDefault
        return (storage != projDefault && onLoad) ? storage : projDefault
    }

    const setProjSettings = () => {
        lambda = fromSS('lambda')
        phi = fromSS('phi')
        gamma = fromSS('gamma')
        parallel = fromSS('parallel')
        distance = fromSS('distance')
        tilt = fromSS('tilt')
    }

    let onLoad = true, projOnLoad
    let lambda, phi, gamma, parallel, distance, tilt, clipAngle
    // Au chargement : préférence sessionStorage sur paramètres par défaut
    $: if (onLoad) {
        setProjSettings()
        onLoad = false
        projOnLoad = $projID
    }

    // Au changement de projection : préférence paramètres par défaut
    $: if (!onLoad && projOnLoad != $projID) {
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
        let p = projParams.find( d => d.id === $projID).fn.rotate([lambda, phi, gamma])
        if (parallel || parallel == 0) p.parallel([parallel])
        if (distance) p.distance([distanceD3]).tilt([tilt]).clipAngle([clipAngle])
        $proj = p
    }

    // Projection non paramétrable : input disabled
    const projInputDisabled = ['Bertin 1953', 'Fuller (Airocean']

    // Système de notation des projections
    $: currentProjData = projListSort.filter(d => d.id == $projID)[0]
    
    const dot0 = `<span class="material-icons" id="score" style="font-size: var(--text-medium); color: var(--accent-color);">radio_button_unchecked</span>`
    const dot1 = `<span class="material-icons" id="score" style="font-size: var(--text-medium); color: var(--accent-color);">radio_button_checked</span>`
    const addScore = (score) => {
        switch (score) {
            case 0:
                return dot0 + dot0 + dot0
                break;
            case 1:
                return dot1 + dot0 + dot0
                break;
            case 2:
                return dot1 + dot1 + dot0
                break;
            case 3:
                return dot1 + dot1 + dot1
                break;
        }
    }
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

    

    <select bind:value={$projID} name="projection" id="input_projSelect">
        <optgroup label="Incontournables">
            {#each projListSort.filter(d => d.top == true) as d}
                <option value={d.id}>{d.name}</option>
            {/each}
        </optgroup>
        <optgroup label="Autres">
            {#each projListSort.filter(d => d.top == false) as d}
                <option value={d.id}>{d.name}</option>
            {/each}
        </optgroup>
    </select>
    
    <p><b>Catégorie</b> <br>
        {currentProjData.type}</p>
    <p><b>Caractéristiques</b></p>
    <ul id="scores">
        <li><p>Surface</p>
            <p>{@html addScore(currentProjData.area)}</p>
        </li>
        <li><p>Distance</p>
            <p>{@html addScore(currentProjData.distance)}</p>
        </li>
        <li><p>Angle</p>
            <p>{@html addScore(currentProjData.angle)}</p>
        </li>
    </ul>


    <h3>Paramètres</h3>
    <ul id="projParams">
        <li>
            <label for="lon">Longitude</label>
            <input type="range" bind:value={lambda} id="lon" min="-180" max="180" step="1" disabled={isNaN(lambda) || projInputDisabled.includes($projID)}>
            <input type="number" bind:value={lambda} id="lon" min="-180" max="180" step="1" disabled={isNaN(lambda) || projInputDisabled.includes($projID)}>
        </li>
        <li>
            <label for="lat">Latitude</label>
            <input type="range" bind:value={phi} id="lat" min="-90" max="90" step="1" disabled={isNaN(phi) || projInputDisabled.includes($projID)}>
            <input type="number" bind:value={phi} id="lat" min="-90" max="90" step="1" disabled={isNaN(phi) || projInputDisabled.includes($projID)}>
        </li>
        <li>
            <label for="rot">Rotation</label>
            <input type="range" bind:value={gamma} id="rot" min="-180" max="180" step="1" disabled={isNaN(gamma) || projInputDisabled.includes($projID)}>
            <input type="number" bind:value={gamma} id="rot" min="-180" max="180" step="1" disabled={isNaN(gamma) || projInputDisabled.includes($projID)}>
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
    p {
        font-size: var(--text-small);
        margin-bottom: 0;
    }
    li p { margin: 0; }
    #scores {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
    }
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
    ul#projParams li {
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