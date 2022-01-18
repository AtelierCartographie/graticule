import { feature, merge, mesh } from 'topojson-client'
import clip from 'polygon-clipping'
import rewind from '@turf/rewind'

import countries_10m from './basemap/countries_10m.json'
import rivers_10m from './basemap/rivers_10m.json'
import lakes_10m from './basemap/lakes_10m.json'

const land = merge(countries_10m, countries_10m.objects.countries_10m.geometries)

// Polygone de la terre = outline (type: sphere) de d3.js
const sphere = {
    "type": "Polygon",
    "coordinates": [ [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]] ]
}

// /!\ return geojson RFC 7946 compatible
const oceanDiff = {
    "type": "MultiPolygon",
    "coordinates": clip.difference(sphere.coordinates, land.coordinates)
}

// Inverser coordoonées de oceanDiff pour le rendre geojson gj2008 compatible
const ocean = rewind(oceanDiff, {reverse: true})

export const geo10m = {
    ocean: ocean,
    coastline: mesh(countries_10m, countries_10m.objects.countries_10m, (a,b) => a == b),
    countries: feature(countries_10m, countries_10m.objects.countries_10m),
    borders: mesh(countries_10m, countries_10m.objects.countries_10m, (a,b) => a != b),
    rivers: feature(rivers_10m, rivers_10m.objects.rivers_10m),
    lakes: feature(lakes_10m, lakes_10m.objects.lakes_10m)
}