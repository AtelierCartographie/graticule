import { writable } from 'svelte/store'

// Get from sessionStorage
const fromSS = (variable, value) => {
    const storage = sessionStorage.getItem(variable)
    return storage != null
    ? JSON.parse(storage)
    : value
}

// MAP
export const mapReady = writable(false)
export const rectBrush = writable( fromSS('rectBrush', {rx: null, ry: null, rw: null, rh: null}) )
export const zTransform = writable( fromSS('zTransform', {k: 1, x: 0, y: 0}) )
export const zCat = writable()

// SETTINGS
// Frame
export const regSelect = writable( fromSS('regSelect', null) )
export const countrySelect = writable( fromSS('countrySelect', null) )
export const regbbox = writable()
export const countrybbox = writable()
export const zResetMessage = writable()
export const callZoomReset = writable(false)
// Projection
export const projName = writable( fromSS('projName', 'Equal Earth') )
export const proj = writable()
export const projSettings = writable( fromSS('projSettings', {}) ) // {lambda: 0, phi: 0, gamma: 0,...}
// Layers
export const mapTheme = writable( fromSS('mapTheme', 'colorMode') )  // colorMode ou outlineMode
export const mapTitle = writable( fromSS('mapTitle', "Titre de la carte") )
export const lyr = writable( fromSS('lyr', ['ocean', 'graticule', 'coastline', 'countries', 'borders']) )
export const gratType = writable( fromSS('gratType', 'top') )  // top ou all
export const gratStep = writable( fromSS('gratStep', 10) )
export const reliefColor = writable( fromSS('reliefColor', true) )
export const reliefShowLevels = writable( fromSS('reliefShowLevels', false) )
export const reliefLevels = writable( fromSS('reliefLevels', "0,500,1000,2000,3000,4000") )
export const urbanSize = writable( fromSS('urbanSize', 50000) )
export const citiesType = writable( fromSS('citiesType', 'cap') )
export const lyrCSS = writable( fromSS('lyrCSS', {}) )


export const scaleDist = writable( fromSS('scaleDist', null) )
export const scaleBarLeft = writable( fromSS('scaleBarLeft', null) )
export const scaleBarTop = writable( fromSS('scaleBarTop', null) )

// Resolution
export const resType = writable( fromSS('resType', ['dynamic']) )
export const res = writable( fromSS('res', '110m') )

// MODAL
export const isModalOpen = writable(false)
export const modalContent = writable()

// SNACKBAR
export const showSnackbar = writable({state: null, message: null})


// SYNC to sessionStorage
const toSS = (variable, value) => sessionStorage.setItem(variable, JSON.stringify(value))

// MAP
rectBrush.subscribe(d => toSS("rectBrush", d))
zTransform.subscribe(d => toSS("zTransform", d))

// SETTINGS
// Frame
regSelect.subscribe(d => toSS("regSelect", d))
countrySelect.subscribe(d => toSS("countrySelect", d))
// Projection
projName.subscribe(d => toSS("projName", d))
projSettings.subscribe(d => toSS("projSettings", d))
// Layers
lyr.subscribe(d => toSS("lyr", d))
mapTheme.subscribe(d => toSS("mapTheme", d))
mapTitle.subscribe(d => toSS("mapTitle", d))
gratType.subscribe(d => toSS("gratType", d))
gratStep.subscribe(d => toSS("gratStep", d))
reliefColor.subscribe(d => toSS("reliefColor", d))
reliefShowLevels.subscribe(d => toSS("reliefShowLevels", d))
reliefLevels.subscribe(d => toSS("reliefLevels", d))
scaleDist.subscribe(d => toSS("scaleDist", d))
scaleBarLeft.subscribe(d => toSS("scaleBarLeft", d))
scaleBarTop.subscribe(d => toSS("scaleBarTop", d))
urbanSize.subscribe(d => toSS("urbanSize", d))
citiesType.subscribe(d => toSS("citiesType", d))
lyrCSS.subscribe(d => toSS("lyrCSS", d))
// Resolution
resType.subscribe(d => toSS("resType", d))
res.subscribe(d => toSS("res", d))