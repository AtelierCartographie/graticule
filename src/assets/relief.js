import GeoTIFF, { fromUrl } from 'geotiff';

import z0_4326 from '../assets/basemap/z0_4326.tif?url'

// const arrayBuffer = await z0_4326.arrayBuffer()
// console.log(arrayBuffer)
const tiff = await fromUrl(z0_4326)
const image = await tiff.getImage()

export const z110m = await image.readRasters() // [values, width, height]