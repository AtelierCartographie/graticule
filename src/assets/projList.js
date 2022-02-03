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

const projParams = [
    {id: "equalEarth", fn: geoEqualEarth(), lambda: 0, phi: 0, gamma: 0},
    {id: "naturalEarth2", fn: geoNaturalEarth2(), lambda: 0, phi: 0, gamma: 0},
    {id: "armadillo", fn: geoArmadillo(), lambda: -10, phi: NaN, gamma: NaN, parallel: 20},
    {id: "bertin53", fn: geoBertin1953(), lambda: -16, phi: -42, gamma: 0},
    {id: "bonne", fn: geoBonne(), lambda: 0, phi: 0, gamma: 0, parallel: 45},
    {id: "orthographic", fn: geoOrthographic(), lambda: 15, phi: -40, gamma: 0},
    {id: "interruptedMollweide", fn: geoInterruptedMollweide(), lambda: 0, phi: 0, gamma: 0},
    {id: "atlantis", fn: geoMollweide(), lambda: 30, phi: -45, gamma: 90},
    {id: "satellite", fn: geoSatellite(), lambda: 0, phi: 0, gamma: 0, distance: 35786, tilt: 0},
    {id: "mercator", fn: geoMercator(), lambda: 0, phi: 0, gamma: 0},
    {id: "equirectangular", fn: geoEquirectangular(), lambda: 0, phi: 0, gamma: 0},
    {id: "mollweideHemisphere", fn: geoInterruptedMollweideHemispheres(), lambda: 20, phi: 0, gamma: 0},
    {id: "laea", fn: geoAzimuthalEqualArea(), lambda: 0, phi: -89, gamma: 0},
//     {name: "Fuller (Airocean)", top: false, fn: geoAirocean(), lambda: -83.65929, phi: 25.44458, gamma: -87.45184},
]


const projList = [
        {id: "equalEarth", name: "Equal Earth", top: true, type: 'Pseudo-cylindrique', area: 3, distance: 1, angle: 1},
        {id: "naturalEarth2", name: "Natural Earth 2", top: false, type: 'Pseudo-cylindrique', area: 2, distance: 3, angle: 1},
        {id: "armadillo", name: "Armadillo", top: false, type: 'Autre', area: 1, distance: 0, angle: 1},
        {id: "bertin53", name: "Bertin 1953", top: true, type: 'Autre', area: 2, distance: 1, angle: 0},
        {id: "bonne", name: "Bonne", top: false, type: 'Pseudo-conique', area: 1, distance: 1, angle: 0},
        {id: "orthographic", name: "Orthographique", top: true, type: 'Azimutale', area: 1, distance: 1, angle: 1},
        {id: "interruptedMollweide", name: "Mollweide interrompue", top: false, type: 'Pseudo-cylindrique', area: 3, distance: 1, angle: 0},
        {id: "atlantis", name: "Atlantis", top: false, type: 'Pseudo-cylindrique', area: 3, distance: 1, angle: 0},
        {id: "satellite", name: "Satellite", top: false, type: 'Autre', area: 1, distance: 1, angle: 1},
        {id: "mercator", name: "Mercator", top: false, type: 'Cylindrique', area: 0, distance: 0, angle: 3},
        {id: "equirectangular", name: "Plate Carrée", top: true, type: 'Cylindrique', area: 1, distance: 3, angle: 1},
        {id: "mollweideHemisphere", name: "Mollweide interrompue en 2 hémisphères", top: false, type: 'Pseudo-cylindrique', area: 3, distance: 1, angle: 0},
        {id: "laea", name: "Lambert azimutale équivalente (LAEA)", top: false, type: 'Azimutale', area: 3, distance: 1, angle: 0},
    ]

// trie les projections par nom
const projListSort = projList.sort( (a,b) => a.name.localeCompare(b.name))

export { projParams, projListSort }
