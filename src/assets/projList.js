import {geoAzimuthalEqualArea,
        geoMercator,
        geoEqualEarth,
        geoEquirectangular,
        geoOrthographic } from 'd3-geo'
import {geoArmadillo,
        geoBertin1953,
        geoBonne,
        geoMollweide,
        geoNaturalEarth2,
        geoInterruptedMollweide,
        geoInterruptedMollweideHemispheres,
        geoSatellite } from 'd3-geo-projection'
import {geoAirocean } from 'd3-geo-polygon'

const projList = [
    {name: "Equal Earth", top: true, fn: geoEqualEarth(), lambda: 0, phi: 0, gamma: 0},
    {name: "Natural Earth 2", top: false, fn: geoNaturalEarth2(), lambda: 0, phi: 0, gamma: 0},
    {name: "Armadillo", top: false, fn: geoArmadillo(), lambda: -10, phi: NaN, gamma: NaN, parallel: 20},
    {name: "Bertin 1953", top: true, fn: geoBertin1953(), lambda: -16, phi: -42, gamma: 0},
    {name: "Bonne", top: false, fn: geoBonne(), lambda: 0, phi: 0, gamma: 0, parallel: 45},
    {name: "Orthographic", top: true, fn: geoOrthographic(), lambda: 15, phi: -40, gamma: 0},
    {name: "Interrupted Mollweide", top: false, fn: geoInterruptedMollweide(), lambda: 0, phi: 0, gamma: 0},
    {name: "Atlantis", top: false, fn: geoMollweide(), lambda: 30, phi: -45, gamma: 90},
    {name: "Satellite", top: false, fn: geoSatellite(), lambda: 0, phi: 0, gamma: 0, distance: 35786, tilt: 0},
    {name: "Mercator", top: false, fn: geoMercator(), lambda: 0, phi: 0, gamma: 0},
    {name: "Plate Carrée", top: true, fn: geoEquirectangular(), lambda: 0, phi: 0, gamma: 0},
    {name: "Mollweide Hemispheres", top: false, fn: geoInterruptedMollweideHemispheres(), lambda: 20, phi: 0, gamma: 0},
    {name: "Lambert azimutale équivalente (LAEA)", top: false, fn: geoAzimuthalEqualArea(), lambda: 0, phi: -89, gamma: 0},
//     {name: "Fuller (Airocean)", top: false, fn: geoAirocean(), lambda: -83.65929, phi: 25.44458, gamma: -87.45184},
]

// trie les projections par nom
const projListSort = projList.sort( (a,b) => a.name.localeCompare(b.name))

export default projListSort