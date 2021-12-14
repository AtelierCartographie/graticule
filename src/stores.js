import { writable } from 'svelte/store'

// MAP
export const mapReady = writable()
export const zTransform = writable({ k: 1, x: 0, y: 0})
export const zCat = writable()

// SETTINGS
// Frame
export const regbbox = writable()
export const countrybbox = writable()
// Projection
export const projName = writable('Equal Earth')
export const proj = writable()
// Layers
export const mapTheme = writable('colorMode')       // colorMode ou outlineMode
export const lyr = writable(['ocean', 'graticule', 'countries', 'borders'])
export const mapTitle = writable("Titre de la carte")
export const canAddScale = writable()
export const scaleDist = writable()
export const gratType = writable('top')             // top ou all
export const gratStep = writable(10)
export const urbanSize = writable(50000)
export const zLevels = writable([0,500,1000,2000,3000])
export const zColor = writable(true)
// Resolution
export const resType = writable(['dynamic'])
export const res = writable('110m')

// MODAL
export const isModalOpen = writable(false)
export const modalContent = writable()