import { feature, merge, mesh } from 'topojson-client'
import clip from 'polygon-clipping'
import rewind from '@turf/rewind'

import countries_50m from './basemap/countries_50m.json'
import rivers_50m from './basemap/rivers_50m.json'
import lakes_50m from './basemap/lakes_50m.json'

const land = merge(countries_50m, countries_50m.objects.countries_50m.geometries)

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

export const geo50m = {
    ocean: ocean,
    coastline: mesh(countries_50m, countries_50m.objects.countries_50m, (a,b) => a == b),
    countries: feature(countries_50m, countries_50m.objects.countries_50m),
    borders: mesh(countries_50m, countries_50m.objects.countries_50m, (a,b) => a != b),
    rivers: feature(rivers_50m, rivers_50m.objects.rivers_50m),
    lakes: feature(lakes_50m, lakes_50m.objects.lakes_50m)
}