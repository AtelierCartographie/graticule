import { geoEqualEarth, geoOrthographic } from 'd3-geo'
import { geoArmadillo,
        geoBertin1953,
        geoBonne,
        geoMollweide,
        geoNaturalEarth2,
        geoInterruptedMollweide,
        geoSatellite } from 'd3-geo-projection'

const proj_list = [
    {name: "Equal Earth", fn: geoEqualEarth(), lambda: 0, phi: 0, gamma: 0},
    {name: "Natural Earth 2", fn: geoNaturalEarth2(), lambda: 0, phi: 0, gamma: 0},
    {name: "Armadillo", fn: geoArmadillo(), lambda: -10, phi: NaN, gamma: NaN, parallel: 20},
    {name: "Bertin 1953", fn: geoBertin1953(), lambda: -16, phi: -42, gamma: 0},
    {name: "Bonne", fn: geoBonne(), lambda: 0, phi: 0, gamma: 0, parallel: 45},
    {name: "Orthographic", fn: geoOrthographic(), lambda: 0, phi: 0, gamma: 0},
    {name: "Interrupted Mollweide", fn: geoInterruptedMollweide(), lambda: 0, phi: 0, gamma: 0},
    {name: "Atlantis", fn: geoMollweide(), lambda: 30, phi: -45, gamma: 90},
    {name: "Satellite", fn: geoSatellite(), lambda: 0, phi: 0, gamma: 0, distance: 6.61, tilt: 0},
]

export default proj_list