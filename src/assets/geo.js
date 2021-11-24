import basemap from './basemap.json'
import { feature } from 'topojson-client'

const geo = {
    land: feature(basemap, basemap.objects.land),
    countries: feature(basemap, basemap.objects.countries),
    borders: feature(basemap, basemap.objects.borders),
    borders_disputed: feature(basemap, basemap.objects.borders_disputed),
    urban: feature(basemap, basemap.objects.urban)
}
export default geo

export const countries = geo.countries.features.sort( (a,b) => a.properties.name.localeCompare(b.properties.name) )
