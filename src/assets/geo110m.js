import { feature, merge, mesh } from 'topojson-client'

import countries_110m from './basemap/countries_110m.json'
import rivers_110m from './basemap/rivers_110m.json'
import lakes_110m from './basemap/lakes_110m.json'

export const geo110m = {
    coastline: mesh(countries_110m, countries_110m.objects.countries_110m, (a,b) => a == b),
    land: merge(countries_110m, countries_110m.objects.countries_110m.geometries),
    countries: feature(countries_110m, countries_110m.objects.countries_110m),
    borders: mesh(countries_110m, countries_110m.objects.countries_110m, (a,b) => a != b),
    rivers: feature(rivers_110m, rivers_110m.objects.rivers_110m),
    lakes: feature(lakes_110m, lakes_110m.objects.lakes_110m)
}