<script>
    // Exemple simplifié avec un seul composant : https://svelte.dev/repl/ee4070a850944f92b0127ce5cebf0120?version=3.43.1
    import { projID, proj, projSettings, isModalOpen, modalContent, showTissot, adaptProj, adaptZoom, frameCenter, bboxType } from '../../stores.js'
    import Tip from '../UI/Tip.svelte'
    import Badge from '../UI/Badge.svelte'
    // import { projParams, projListSort } from '../../assets/projList.js'
    import * as projData from '../../assets/projList.js'
    import inView from '../js/inView.js'
    import stepEnter from '../js/stepEnter.js'
    import tooltip from '../js/tooltip.js'

    // Tips message
    let m1 = "Choisir parmi la liste de projections et régler si besoin les paramètres."


    // Paramètres des projections : par défaut selon 'projList' puis dynamique via les input
    // Vérifier si valeurs dans la sessionStorage (SS) différente des valeurs par défaut
    const fromSS = (v) => {
        const storage = $projSettings[v]
        const projDefault = projData.params.find( d => d.id === $projID)[v]

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
        let p = projData.params.find( d => d.id === $projID).fn.rotate([lambda, phi, gamma])
        if (parallel || parallel == 0) p.parallel([parallel])
        if (distance) p.distance([distanceD3]).tilt([tilt]).clipAngle([clipAngle])
        $proj = p
    }

    // Projection non paramétrable : input disabled
    const projInputDisabled = {
        lambda: ['bertin53', 'fuller', 'atlantis'],
        phi: ['bertin53', 'fuller', 'armadillo'],
        gamma: ['bertin53', 'fuller', 'atlantis', 'armadillo'],
        phiAdaptProj: ['equalEarth', 'naturalEarth2', 'mercator', 'equirectangular'],
        noAdaptProj: ['bertin53', 'armadillo', 'interruptedMollweide', 'mollweideHemisphere']
    }

    // Système de notation des projections
    $: currentProjData = projData.listSort.filter(d => d.id == $projID)[0]
    
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
    
    // ADAPTER la projection au cadrage
    $: if ($frameCenter) {
        const [lon,lat] = $frameCenter
        if (!projInputDisabled.lambda.includes($projID)) lambda = -lon
        if (!projInputDisabled.phi.includes($projID) &&
            !projInputDisabled.phiAdaptProj.includes($projID)) phi = -lat
        
        if ($bboxType == 'freeFrame') $adaptZoom = true
        else $frameCenter = null
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
        <optgroup label="Échelle globale">
            {#each projData.listSort.filter(d => d.list.includes('global')) as d}
                <option value={d.id}>{d.name}</option>
            {/each}
        </optgroup>
        <optgroup label="Échelle régionale">
            {#each projData.listSort.filter(d => d.list.includes('regional')) as d}
                <option value={d.id}>{d.name}</option>
            {/each}
        </optgroup>
        <optgroup label="Échelle locale">
            {#each projData.listSort.filter(d => d.list.includes('local')) as d}
                <option value={d.id}>{d.name}</option>
            {/each}
        </optgroup>
    </select>

    <p class='infos'>Catégorie : {currentProjData.type}</p>
    <p class='infos'>Échelle : {currentProjData.scale}</p>
    <details>
        <summary>En savoir plus</summary>
        {currentProjData.description}
    </details>

    <h3>Paramètres</h3>
    <ul id="projParams">
        <li>
            <label for="lon">Longitude</label>
            <input type="range" bind:value={lambda} id="lon" min="-180" max="180" step="1" disabled={isNaN(lambda) || projInputDisabled.lambda.includes($projID)}>
            <input type="number" bind:value={lambda} id="lon" min="-180" max="180" step="1" disabled={isNaN(lambda) || projInputDisabled.lambda.includes($projID)}>
        </li>
        <li>
            <label for="lat">Latitude</label>
            <input type="range" bind:value={phi} id="lat" min="-90" max="90" step="1" disabled={isNaN(phi) || projInputDisabled.phi.includes($projID)}>
            <input type="number" bind:value={phi} id="lat" min="-90" max="90" step="1" disabled={isNaN(phi) || projInputDisabled.phi.includes($projID)}>
        </li>
        <li>
            <label for="rot">Rotation</label>
            <input type="range" bind:value={gamma} id="rot" min="-180" max="180" step="1" disabled={isNaN(gamma) || projInputDisabled.gamma.includes($projID)}>
            <input type="number" bind:value={gamma} id="rot" min="-180" max="180" step="1" disabled={isNaN(gamma) || projInputDisabled.gamma.includes($projID)}>
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

    <div>
        {#if $projID != 'bertin53'}
        <Badge onClick={() => setProjSettings()}
            tooltipParams={{placement: 'right'}}
            title="Retour aux paramètres par défaut"
            text="Par défaut" />
        {/if}
        
        {#if !projInputDisabled.noAdaptProj.includes($projID)}
        <Badge onClick={() => adaptProj.set(true)}
            tooltipParams={{placement: 'right'}}
            title="Adapter les paramètres de la projection au cadrage"
            text="Adapter au cadrage" />
        {/if}
    </div>
    



    <h3>Caractéristiques</h3>
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

    <Badge onClick={() => $showTissot = !$showTissot}
        classActive={$showTissot}
        tooltipParams={{placement: 'right'}}
        title="L'application régulière de cercles de diamètre constant indique visuellement les déformations de surface et de forme de la projection"
        text="Indicateur de Tissot" />
</section>



<style>
    p {
        font-size: var(--text-medium);
        margin: 0;
    }
    .infos:first-of-type { margin-top: .5rem; }
    .infos { margin-bottom: .5rem; }
    details { 
        font-size: var(--text-small);
    }
    summary {
        font-size: var(--text-medium);
    }
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
        margin-bottom: .5rem;
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