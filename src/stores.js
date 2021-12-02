import { writable } from 'svelte/store'

// MAP
export const mapReady = writable()
export const zTransform = writable({ k: 1, x: 0, y: 0})

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

// MODAL
export const isModalOpen = writable(false)
export const modalContent = writable()