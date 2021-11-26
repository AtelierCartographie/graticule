import { select, selectAll } from 'd3-selection'

export default function stepEnter(id) {
    selectAll(".navSteps").classed("inView", false)
    select(`#${id}`).classed("inView", true)

    // Highlight rectangle de cadrage à l'étape Cadrer
    id == 'headerFrame'
    ? select("#cadrage").classed("inView", true)
    : select("#cadrage").classed("inView", false)
}