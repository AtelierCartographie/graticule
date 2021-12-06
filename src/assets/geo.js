import { feature, mesh } from 'topojson-client'

import countries_110m from './basemap/countries_110m.json'
import countries_50m from './basemap/countries_50m.json'
import countries_10m from './basemap/countries_10m.json'

import rivers_110m from './basemap/rivers_110m.json'
import rivers_50m from './basemap/rivers_50m.json'
import rivers_10m from './basemap/rivers_10m.json'

import lakes_110m from './basemap/lakes_110m.json'
import lakes_50m from './basemap/lakes_50m.json'
import lakes_10m from './basemap/lakes_10m.json'

import urban_all from './basemap/urban.json'

export const geo_110m = {
    coastline: mesh(countries_110m, countries_110m.objects.countries_110m, (a,b) => a == b),
    countries: feature(countries_110m, countries_110m.objects.countries_110m),
    borders: mesh(countries_110m, countries_110m.objects.countries_110m, (a,b) => a != b),
    rivers: feature(rivers_110m, rivers_110m.objects.rivers_110m),
    lakes: feature(lakes_110m, lakes_110m.objects.lakes_110m)
}

export const geo_50m = {
    coastline: mesh(countries_50m, countries_50m.objects.countries_50m, (a,b) => a == b),
    countries: feature(countries_50m, countries_50m.objects.countries_50m),
    borders: mesh(countries_50m, countries_50m.objects.countries_50m, (a,b) => a != b),
    rivers: feature(rivers_50m, rivers_50m.objects.rivers_50m),
    lakes: feature(lakes_50m, lakes_50m.objects.lakes_50m)
}

export const geo_10m = {
    coastline: mesh(countries_10m, countries_10m.objects.countries_10m, (a,b) => a == b),
    countries: feature(countries_10m, countries_10m.objects.countries_10m),
    borders: mesh(countries_10m, countries_10m.objects.countries_10m, (a,b) => a != b),
    rivers: feature(rivers_10m, rivers_10m.objects.rivers_10m),
    lakes: feature(lakes_10m, lakes_10m.objects.lakes_10m)
}

export const urban = feature(urban_all, urban_all.objects.urban)

// TODO, dans basemap.svelte path manuel pour chaque couche plutôt qu'un {#each}
