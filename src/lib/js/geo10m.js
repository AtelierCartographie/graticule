import { feature, merge, mesh } from 'topojson-client'

import countries_10m from '../../assets/basemap/countries_10m.json'
import rivers_10m from '../../assets/basemap/rivers_10m.json'
import lakes_10m from '../../assets/basemap/lakes_10m.json'

const land = merge(countries_10m, countries_10m.objects.countries_10m.geometries)

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

export const geo10m = {
    ocean: ocean,
    coastline: mesh(countries_10m, countries_10m.objects.countries_10m, (a,b) => a == b),
    land: land,
    countries: feature(countries_10m, countries_10m.objects.countries_10m),
    borders: mesh(countries_10m, countries_10m.objects.countries_10m, (a,b) => a != b),
    rivers: feature(rivers_10m, rivers_10m.objects.rivers_10m),
    lakes: feature(lakes_10m, lakes_10m.objects.lakes_10m)
}