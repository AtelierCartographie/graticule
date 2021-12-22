import GeoTIFF, { fromUrl } from 'geotiff';

import z0 from '../assets/basemap/z0.tif'
import z1 from '../assets/basemap/z1.tif'
import z2 from '../assets/basemap/z2.tif'


async function getRaster(url) {
    const tiff = await fromUrl(url)
    const image = await tiff.getImage()
    const r = await image.readRasters() // [values, width, height]
    return r
}

export const r110m = await getRaster(z0)

export const r50m = await getRaster(z1)

export const r10m = await getRaster(z2)