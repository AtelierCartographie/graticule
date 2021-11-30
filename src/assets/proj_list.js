import { geoEqualEarth, geoOrthographic } from 'd3-geo'
import { geoArmadillo,
        geoBertin1953,
        geoBonne,
        geoMollweide,
        geoNaturalEarth2,
        geoInterruptedMollweide,
        geoSatellite } from 'd3-geo-projection'

const proj_list = [
    {name: "Equal Earth", top: true, fn: geoEqualEarth(), lambda: 0, phi: 0, gamma: 0},
    {name: "Natural Earth 2", top: false, fn: geoNaturalEarth2(), lambda: 0, phi: 0, gamma: 0},
    {name: "Armadillo", top: false, fn: geoArmadillo(), lambda: -10, phi: NaN, gamma: NaN, parallel: 20},
    {name: "Bertin 1953", top: true, fn: geoBertin1953(), lambda: -16, phi: -42, gamma: 0},
    {name: "Bonne", top: false, fn: geoBonne(), lambda: 0, phi: 0, gamma: 0, parallel: 45},
    {name: "Orthographic", top: true, fn: geoOrthographic(), lambda: 0, phi: 0, gamma: 0},
    {name: "Interrupted Mollweide", top: false, fn: geoInterruptedMollweide(), lambda: 0, phi: 0, gamma: 0},
    {name: "Atlantis", top: false, fn: geoMollweide(), lambda: 30, phi: -45, gamma: 90},
    {name: "Satellite", top: false, fn: geoSatellite(), lambda: 0, phi: 0, gamma: 0, distance: 6.61, tilt: 0},
]

export default proj_list.sort( (a,b) => a.name.localeCompare(b.name))