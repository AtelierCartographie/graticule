import { feature, mesh } from 'topojson-client'

import countries_50m from './basemap/countries_50m.json'
import rivers_50m from './basemap/rivers_50m.json'
import lakes_50m from './basemap/lakes_50m.json'

export const geo_50m = {
    coastline: mesh(countries_50m, countries_50m.objects.countries_50m, (a,b) => a == b),
    countries: feature(countries_50m, countries_50m.objects.countries_50m),
    borders: mesh(countries_50m, countries_50m.objects.countries_50m, (a,b) => a != b),
    rivers: feature(rivers_50m, rivers_50m.objects.rivers_50m),
    lakes: feature(lakes_50m, lakes_50m.objects.lakes_50m)
}