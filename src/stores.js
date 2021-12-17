import { writable } from 'svelte/store'

const fromLS = (variable, value) => {
    const storage = localStorage.getItem(variable)
    return storage != null
    ? JSON.parse(storage)
    : value
}

// MAP
export const mapReady = writable()
export const zTransform = writable({ k: 1, x: 0, y: 0})
export const zCat = writable()

// SETTINGS
// Frame
export const regSelect = writable( fromLS('regSelect', null) )
export const countrySelect = writable( fromLS('countrySelect', null) )
export const regbbox = writable()
export const countrybbox = writable()
// Projection
export const projName = writable( fromLS('projName', 'Equal Earth') )
export const proj = writable()
export const projSettings = writable( fromLS('projSettings', {}) ) // {lambda: 0, phi: 0, gamma: 0,...}
// Layers
export const mapTheme = writable( fromLS('mapTheme', 'colorMode') )  // colorMode ou outlineMode
export const lyr = writable( fromLS('lyr', ['ocean', 'graticule', 'countries', 'borders']) )
export const mapTitle = writable( fromLS('mapTitle', "Titre de la carte") )
export const canAddScale = writable()
export const scaleDist = writable()
export const gratType = writable( fromLS('gratType', 'top') )  // top ou all
export const gratStep = writable( fromLS('gratStep', 10) )
export const urbanSize = writable( fromLS('urbanSize', 50000) )
export const zLevels = writable([0,500,1000,2000,3000,4000])
export const zColor = writable( fromLS('countrySelect', true) )
// Resolution
export const resType = writable( fromLS('resType', ['dynamic']) )
export const res = writable( fromLS('res', '110m') )

// MODAL
export const isModalOpen = writable(false)
export const modalContent = writable()

// SNACKBAR
export const showSnackbar = writable({state: null, message: null})


// SYNC to localStorage
const toLS = (variable, value) => localStorage.setItem(variable, JSON.stringify(value))

// SETTINGS
// Frame
regSelect.subscribe(d => toLS("regSelect", d))
countrySelect.subscribe(d => toLS("countrySelect", d))
// Projection
projName.subscribe(d => toLS("projName", d))
projSettings.subscribe(d => toLS("projSettings", d))
// Layers
lyr.subscribe(d => toLS("lyr", d))
mapTheme.subscribe(d => toLS("mapTheme", d))
mapTitle.subscribe(d => toLS("mapTitle", d))
gratType.subscribe(d => toLS("gratType", d))
gratStep.subscribe(d => toLS("gratStep", d))
urbanSize.subscribe(d => toLS("urbanSize", d))
zColor.subscribe(d => toLS("zColor", d))
// Resolution
resType.subscribe(d => toLS("resType", d))
res.subscribe(d => toLS("res", d))