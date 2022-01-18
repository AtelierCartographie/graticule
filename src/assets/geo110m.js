import { feature, merge, mesh } from 'topojson-client'
import clip from 'polygon-clipping'
import rewind from '@turf/rewind'

import countries_110m from './basemap/countries_110m.json'
import rivers_110m from './basemap/rivers_110m.json'
import lakes_110m from './basemap/lakes_110m.json'

const land = merge(countries_110m, countries_110m.objects.countries_110m.geometries)

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

export const geo110m = {
    ocean: ocean,
    coastline: mesh(countries_110m, countries_110m.objects.countries_110m, (a,b) => a == b),
    countries: feature(countries_110m, countries_110m.objects.countries_110m),
    borders: mesh(countries_110m, countries_110m.objects.countries_110m, (a,b) => a != b),
    rivers: feature(rivers_110m, rivers_110m.objects.rivers_110m),
    lakes: feature(lakes_110m, lakes_110m.objects.lakes_110m)
}