import { feature, merge, mesh } from 'topojson-client'

import countries_50m from '../../assets/basemap/countries_50m.json'
import rivers_50m from '../../assets/basemap/rivers_50m.json'
import lakes_50m from '../../assets/basemap/lakes_50m.json'

const land = merge(countries_50m, countries_50m.objects.countries_50m.geometries)

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

export const geo50m = {
    ocean: ocean,
    coastline: mesh(countries_50m, countries_50m.objects.countries_50m, (a,b) => a == b),
    land: land,
    countries: feature(countries_50m, countries_50m.objects.countries_50m),
    borders: mesh(countries_50m, countries_50m.objects.countries_50m, (a,b) => a != b),
    rivers: feature(rivers_50m, rivers_50m.objects.rivers_50m),
    lakes: feature(lakes_50m, lakes_50m.objects.lakes_50m)
}