import { select, selectAll } from 'd3-selection'

export default function stepEnter(id) {
    selectAll(".navSteps").classed("inView", false)
    select(`#${id}`).classed("inView", true)
}