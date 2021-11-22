import { writable } from 'svelte/store'

export const proj = writable()
export const regbbox = writable()
export const lyr = writable()
export const zTransform = writable({ k: 1, x: 0, y: 0})
export const mapTitle = writable()
export const scaleDist = writable()
export const canAddScale = writable()
export const mapReady = writable()
export const isModalOpen = writable(false)
export const urbanSize = writable(50000)