import { select, selectAll } from 'd3-selection'
// import { get } from 'svelte/store';
import { stepActive } from '../../stores.js'

// Synchronise les boutons d'étapes du header avec l'affichage des étapes
// La classe css .inView met en avant l'étape courante
export default function stepEnter(id) {
    // utile au bouton continuer de navSettings
    stepActive.set(id)

    selectAll(".navSteps").classed("inView", false)
    select(`#${id}`).classed("inView", true)

    // Highlight rectangle de cadrage à l'étape Cadrer
    id == 'headerFrame'
    ? select("#cadrage").classed("inView", true)
    : select("#cadrage").classed("inView", false)
}