import GeoTIFF, { fromUrl } from 'geotiff';

// raster geotif d'élévation (en mètre) à trois résolutions
// dérivé de trois zoom de Terrain Tiles par Mapzen/Nextzen
// les rasters sont :
// - découpé selon un buffer de la couche NaturalEarth  land 10m
// - convertit en projection EPSG:4326
// - valeurs arrondi à la centaine et converti de Float32 à Int16
// - compression
import z0 from './basemap/z0.tif'
import z1 from './basemap/z1.tif'
import z2 from './basemap/z2.tif'



// Récupère les données d'un raster
async function getRaster(url) {
    const tiff = await fromUrl(url)
    const image = await tiff.getImage()
    const r = await image.readRasters() // [values, width, height]
    return r
}

export const r110m = await getRaster(z0)

export const r50m = await getRaster(z1)

export const r10m = await getRaster(z2)