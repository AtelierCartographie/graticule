<script>
    // Exemple simplifié avec un seul composant : https://svelte.dev/repl/ee4070a850944f92b0127ce5cebf0120?version=3.43.1
    import { proj } from '../../stores.js'
    import Tip from './Tip.svelte'
    import proj_list from '../../assets/proj_list.js'
    import inView from '../../assets/inView.js'
    import stepEnter from '../../assets/stepEnter.js'
    import tooltip from '../../assets/tooltip.js'

    let proj_selected = "Natural Earth 2"

    // Paramètres des projections : par défaut selon 'proj_list' puis dynamique via les input
    $: lambda = proj_list.find( d => d.name === proj_selected).lambda
    $: phi = proj_list.find( d => d.name === proj_selected).phi
    $: gamma = proj_list.find( d => d.name === proj_selected).gamma
    $: parallel = proj_list.find( d => d.name === proj_selected).parallel
    $: distance = proj_list.find( d => d.name === proj_selected).distance
    $: tilt = proj_list.find( d => d.name === proj_selected).tilt
    $: clipAngle = Math.acos( 1 / distance ) * 180 / Math.PI

    $: {
        let p = proj_list.find( d => d.name === proj_selected).fn.rotate([lambda, phi, gamma])
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

    <form id="proj-select">
        <label for="proj-select">Sélectionner une projection</label>

        <select bind:value={proj_selected} name="projection" id="proj-select">
            {#each proj_list as d}
                <option value={d.name}>{d.name}</option>
            {/each}
        </select>
        <span use:tooltip title="Cliquer pour en savoir plus" class="material-icons tooltip">help_outline</span>
    </form>



    <form id="proj-rotate">
        <h3>Paramétrage de la projection</h3>
        <ul>
            <li>
                <label for="lon">Longitude</label>
                <input type="range" bind:value={lambda} id="lon" min="-180" max="180" step="1" disabled={isNaN(lambda) || proj_selected == "Bertin 1953"}>
                <input type="number" bind:value={lambda} min="-180" max="180" step="1" disabled={isNaN(lambda) || proj_selected == "Bertin 1953"}>
            </li>
            <li>
                <label for="lat">Latitude</label>
                <input type="range" bind:value={phi} id="lat" min="-90" max="90" step="1" disabled={isNaN(phi) || proj_selected == "Bertin 1953"}>
                <input type="number" bind:value={phi} min="-90" max="90" step="1" disabled={isNaN(phi) || proj_selected == "Bertin 1953"}>
            </li>
            <li>
                <label for="rot">Rotation</label>
                <input type="range" bind:value={gamma} id="rot" min="-180" max="180" step="1" disabled={isNaN(gamma) || proj_selected == "Bertin 1953"}>
                <input type="number" bind:value={gamma} min="-180" max="180" step="1" disabled={isNaN(gamma) || proj_selected == "Bertin 1953"}>
            </li>
            {#if parallel || parallel == 0}
            <li>
                <label for="parallel">Parallèle</label>
                <input type="range" bind:value={parallel} id="parallel" min="-90" max="90" step="1" >
                <input type="number" bind:value={parallel} min="-90" max="90" step="1" >
            </li>
            {/if}
            {#if distance}
            <li>
                <label for="alt">Altitude en km</label>
                <input type="range" bind:value={distance} id="alt" min="1" max="16" step="0.1" >
                <input type="number" bind:value={distance} min="1" max="16" step="0.1" >
            </li>
            <li>
                <label for="tilt">Inclinaison en degré</label>
                <input type="range" bind:value={tilt} id="tilt" min="0" max="90" step="1" >
                <input type="number" bind:value={tilt} min="0" max="90" step="1" >
            </li>
            {/if}
        </ul>
    </form>
    <a href="#layers" class="next-section">
        <p>continuer</p>
        <span class="material-icons">expand_more</span>
    </a>
</section>



<style>
    #proj-select label {
        font-size: var(--text-medium);
        font-weight: bold;
        color: var(--dark-grey);
    }
    #proj-rotate ul {
        list-style-type: none;
        padding: 0;
    }
    #proj-rotate li {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        gap: 1ch;
    }
    #proj-rotate label {
        /* Taille du label */
        flex: 1;
        font-size: var(--text-medium);
    }
    input[type="range"] { width: 8rem; }
    input[type="number"] { width: 2rem; font-size: var(--text-small); }
</style>