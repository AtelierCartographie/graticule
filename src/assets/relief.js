import GeoTIFF, { fromUrl } from 'geotiff';

import z0 from '../assets/basemap/z0.tif'
import z1 from '../assets/basemap/z1.tif'
import z2 from '../assets/basemap/z2.tif'


async function getZ(url) {
    const tiff = await fromUrl(url)
    const image = await tiff.getImage()
    const z = await image.readRasters() // [values, width, height]
    return z
}

export const z110m = await getZ(z0)

export const z50m = await getZ(z1)

export const z10m = await getZ(z2)