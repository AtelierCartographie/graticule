import { feature, merge, mesh } from 'topojson-client'

import countries_110m from '../../assets/basemap/countries_110m.json'
import rivers_110m from '../../assets/basemap/rivers_110m.json'
import lakes_110m from '../../assets/basemap/lakes_110m.json'

const land = merge(countries_110m, countries_110m.objects.countries_110m.geometries)

// D'après Philippe Rivière (Fil)
// https://observablehq.com/@tombor/oceans-a-partir-des-pays
const c = land.coordinates.slice().sort(([a], [b]) => b.length - a.length)
const ocean = {
    type: "MultiPolygon",
    coordinates: [
        c.map(([outerRing]) => outerRing.slice().reverse()),
        c.flatMap(([, ...holes]) => holes.map((r) => r.slice().reverse()))
    ]
}

export const geo110m = {
    ocean: ocean,
    coastline: mesh(countries_110m, countries_110m.objects.countries_110m, (a,b) => a == b),
    land: land,
    countries: feature(countries_110m, countries_110m.objects.countries_110m),
    borders: mesh(countries_110m, countries_110m.objects.countries_110m, (a,b) => a != b),
    rivers: feature(rivers_110m, rivers_110m.objects.rivers_110m),
    lakes: feature(lakes_110m, lakes_110m.objects.lakes_110m)
}