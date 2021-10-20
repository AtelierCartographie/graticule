import basemap from './basemap.json'
import { feature } from 'topojson-client'

const geo = {
    land: feature(basemap, basemap.objects.land),
    borders: feature(basemap, basemap.objects.borders),
    borders_disputed: feature(basemap, basemap.objects.borders_disputed),
    urban: feature(basemap, basemap.objects.urban)
}

export default geo