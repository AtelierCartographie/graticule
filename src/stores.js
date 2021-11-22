import { writable } from 'svelte/store'

// MAP
export const mapReady = writable()
export const zTransform = writable({ k: 1, x: 0, y: 0})

// SETTINGS
// Frame
export const regbbox = writable()
// Projection
export const proj = writable()
// Layers
export const lyr = writable()
export const mapTitle = writable()
export const canAddScale = writable()
export const scaleDist = writable()
export const urbanSize = writable(50000)

// MODAL
export const isModalOpen = writable(false)
export const modalContent = writable()