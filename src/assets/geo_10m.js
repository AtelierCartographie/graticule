import { feature, merge, mesh } from 'topojson-client'

import countries_10m from './basemap/countries_10m.json'
import rivers_10m from './basemap/rivers_10m.json'
import lakes_10m from './basemap/lakes_10m.json'

export const geo_10m = {
    coastline: mesh(countries_10m, countries_10m.objects.countries_10m, (a,b) => a == b),
    land: merge(countries_10m, countries_10m.objects.countries_10m.geometries),
    countries: feature(countries_10m, countries_10m.objects.countries_10m),
    borders: mesh(countries_10m, countries_10m.objects.countries_10m, (a,b) => a != b),
    rivers: feature(rivers_10m, rivers_10m.objects.rivers_10m),
    lakes: feature(lakes_10m, lakes_10m.objects.lakes_10m)
}