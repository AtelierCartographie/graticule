import { feature, mesh } from 'topojson-client'

import countries_110m from './basemap/countries_110m.json'
import countries_50m from './basemap/countries_50m.json'
import countries_10m from './basemap/countries_10m.json'

import urban_all from './basemap/urban.json'

export const geo_110m = {
    coastline: mesh(countries_110m, countries_110m.objects.countries_110m, (a,b) => a == b),
    countries: feature(countries_110m, countries_110m.objects.countries_110m),
    borders: mesh(countries_110m, countries_110m.objects.countries_110m, (a,b) => a != b),
}

export const geo_50m = {
    coastline: mesh(countries_50m, countries_50m.objects.countries_50m, (a,b) => a == b),
    countries: feature(countries_50m, countries_50m.objects.countries_50m),
    borders: mesh(countries_50m, countries_50m.objects.countries_50m, (a,b) => a != b),
}

export const geo_10m = {
    coastline: mesh(countries_10m, countries_10m.objects.countries_10m, (a,b) => a == b),
    countries: feature(countries_10m, countries_10m.objects.countries_10m),
    borders: mesh(countries_10m, countries_10m.objects.countries_10m, (a,b) => a != b),
}

export const urban = feature(urban_all, urban_all.objects.urban)

// TODO, dans basemap.svelte path manuel pour chaque couche plutôt qu'un {#each}
