import { feature, mesh } from 'topojson-client'

import countries_110m from './basemap/countries_110m.json'
import countries_50m from './basemap/countries_50m.json'
import countries_10m from './basemap/countries_10m.json'

import borders_110m from './basemap/borders_110m.json'
import borders_50m from './basemap/borders_50m.json'
import borders_10m from './basemap/borders_10m.json'

import urban_all from './basemap/urban.json'

export const geo_110m = {
    // ocean: feature(ocean_110m, ocean_110m.objects.ocean_110m),
    coastline: mesh(countries_110m, countries_110m.objects.countries_110m, (a,b) => a == b),
    countries: feature(countries_110m, countries_110m.objects.countries_110m),
    borders: feature(borders_110m, borders_110m.objects.borders_110m)
}

export const geo_50m = {
    coastline: mesh(countries_50m, countries_50m.objects.countries_50m, (a,b) => a == b),
    countries: feature(countries_50m, countries_50m.objects.countries_50m),
    borders: feature(borders_50m, borders_50m.objects.borders_50m)
}

export const geo_10m = {
    coastline: mesh(countries_10m, countries_10m.objects.countries_10m, (a,b) => a == b),
    countries: feature(countries_10m, countries_10m.objects.countries_10m),
    borders: feature(borders_10m, borders_10m.objects.borders_10m)
}

export const urban = feature(urban_all, urban_all.objects.urban)

// TODO, dans basemap.svelte path manuel pour chaque couche plutôt qu'un {#each}
