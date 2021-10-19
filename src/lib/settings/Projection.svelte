<script>
    // Exemple simplifié avec un seul composant : https://svelte.dev/repl/ee4070a850944f92b0127ce5cebf0120?version=3.43.1
    import { proj } from '../../stores.js'
    import Tip from './Tip.svelte'

    import { geoEqualEarth } from 'd3-geo'
    import { geoArmadillo, geoBertin1953, geoMollweide, geoNaturalEarth2, geoInterruptedMollweide } from 'd3-geo-projection'

    const proj_list = [
        {name: "Equal Earth", fn: geoEqualEarth(), lambda: 0, phi: 0, gamma: 0},
        {name: "Natural Earth 2", fn: geoNaturalEarth2(), lambda: 0, phi: 0, gamma: 0},
        {name: "Armadillo", fn: geoArmadillo(), lambda: -10, phi: 0, gamma: NaN},
        {name: "Bertin 1953", fn: geoBertin1953(), lambda: -16, phi: -42, gamma: 0},
        {name: "Interrupted Mollweide", fn: geoInterruptedMollweide(), lambda: 0, phi: 0, gamma: 0},
        {name: "Atlantis", fn: geoMollweide().angle(-90), lambda: 30, phi: -45, gamma: 90},
    ]

    let proj_selected = "Natural Earth 2"

    $: lambda = proj_list.find( d => d.name === proj_selected).lambda
    $: phi = proj_list.find( d => d.name === proj_selected).phi
    $: gamma = proj_list.find( d => d.name === proj_selected).gamma

    $: proj.set(proj_list.find( d => d.name === proj_selected).fn.rotate([lambda, phi, gamma]))

    // Tips message
    let m1 = "Pour préciser un cadrage, choisir dans les listes ci-dessous ou bien naviguer directement dans la carte."
    let m2 = "Choisir parmi la liste de projection et régler si besoin les paramètres."
</script>

<h2>Projeter</h2>

<Tip message={m2} />

<form id="proj-select">
    <label for="proj-select">Sélectionner une projection</label>

    <select bind:value={proj_selected} name="projection" id="proj-select">
        {#each proj_list as d}
            <option value={d.name}>{d.name}</option>
        {/each}
    </select>
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
    </ul>
</form>


<style>
    #proj-rotate {
        margin-bottom: var(--step-gap);
    }
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
        justify-content: flex-end;
    }
    #proj-rotate label {
        /* Taille du label */
        flex: 1;
        font-size: var(--text-medium);
    }
    #proj-rotate input {
        /* Taille de l'input par rapport au label (1x, 2x...) */
        flex: 1;
    }
</style>