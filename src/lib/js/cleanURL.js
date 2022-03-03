import { listSort } from '../../assets/projList.js'
import layersList from '../../assets/layersList.js'
import regionsBbox from '../../assets/regionsBbox.json'
import countriesBbox from '../../assets/countriesBbox.json'

// Fonction de filtre d'un objet js
const filterObject = (obj, filtre) => Object.fromEntries(Object.entries(obj).filter(filtre))

// Comparaison brut entre deux arrays ou deux objets
const isEqual = (a,b) => JSON.stringify(a) == JSON.stringify(b)

// Test si un objet js est vide ou non
const isEmpty = (obj) => {
    for (const i in obj) return false
    return true
  }

// Recode les clés d'un objet js
// d'après https://stackoverflow.com/a/45287523
const recodeKeys = (obj, newKeys) => {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

const recodeValues = (obj, newValues) => {
    const keyValues = recodeKeys(obj, newValues)
    return Object.keys(keyValues)
}

// DICTIONNAIRE, dynamique quand c'est possible
// Général
const keyList = ["citiesType", "countrySelect", "gratStep", "gratType", "lyr", "lyrCSS", "mapTheme", "mapTitle", "projID", "projSettings", "regSelect", "reliefColor", "reliefLevels", "reliefShowLevels", "res", "resType", "scaleBarLeft", "scaleBarTop", "scaleDist", "urbanSize", "zTransform", "showTissot"]
// [key, indice]
const dicoKey = Object.fromEntries( keyList.map((d,i) => [d, i+1]) )
// Régions
const dicoReg = Object.fromEntries( regionsBbox.map((d,i) => [d.id, i+1]) )
// Pays
const dicoCountry = Object.fromEntries( countriesBbox.map((d,i) => [d.id, i+1]) )
// Projections, [projName, indice]
const dicoProj = Object.fromEntries( listSort.map((d,i) => [d.id, i+1]) )
// Layers, [layer id, indice]
const dicoLyr = Object.fromEntries( layersList.map((d,i) => [d.id, i+1]) )
// Map theme
const dicoMapTheme = Object.fromEntries( [ ['colorMode', null], ['outlineMode', 2] ] )
// Graticule
const dicoGratType = Object.fromEntries( [ ['top', null], ['all', 2] ] )
// Cities
const dicoCitiesType = Object.fromEntries( [ ['cap', null], ['>100k', 2], ['>250k', 3], ['>500k', 4] ] )
// ResType
const dicoResType = Object.fromEntries( [ ['dynamic', null], [['dynamic', 'constant'], 2] ] )
// Tissot
const dicoTissot = Object.fromEntries( [ ['false', null], ['true', 2] ] )


/* LOGIQUE
/* 1. Renvoyer null pour les valeurs par défaut
/* 2. Ré-encoder l'objet sous forme de lettre et chiffre à l'aide d'un dictionnaire
/*    {a:1,b:1,c:3,...}
/* 4. Encoder en base64 après un JSON.stringify
/* OU
/* 4. Envoyer chaque Key + value dans des paramètres d'url
/*    ?a=1&b=1&C=3 */

export function cleanURL(obj) {
    let s = obj
    // Object.filter(s, ([key,value]) => value != null)
    // FRAME
    s.regSelect = dicoReg[s.regSelect]
    if (s.regSelect == 1) s.regSelect = null

    s.countrySelect = dicoCountry[s.countrySelect]
    if (s.countrySelect == 1) s.countrySelect = null

    // MAP
    if (isEqual(s.zTransform, {k:1,x:0,y:0})) s.zTransform = null
    // PROJ
    s.projID == 'equalEarth'
        ? s.projID = null
        : s.projID = dicoProj[s.projID]
    s.projID == null && isEqual(s.projSettings, {"lambda":0,"phi":0,"gamma":0,"clipAngle":null})
        ? s.projSettings = null
        : s.projSettings = JSON.stringify(s.projSettings)
    s.showTissot = dicoTissot[s.showTissot]
    // LAYERS
    s.mapTheme = dicoMapTheme[s.mapTheme]
    if (s.mapTitle == 'Titre de la carte') s.mapTitle = null
    isEqual(s.lyr, ['ocean', 'graticule', 'coastline', 'countries', 'borders'])
        ? s.lyr = null 
        : s.lyr = JSON.stringify(recodeValues(s.lyr, dicoLyr))
    s.gratType = dicoGratType[s.gratType]
    if (s.gratStep == 10) s.gratStep = null
    if (s.reliefColor) s.reliefColor = null
    if (!s.reliefShowLevels) s.reliefShowLevels = null
    if (s.reliefLevels == "0,500,1000,2000,3000,4000") s.reliefLevels = null
    if (s.urbanSize == 50000) s.urbanSize = null

    s.citiesType = dicoCitiesType[s.citiesType]

    if (s.lyrCSS == {} || isEqual(s.lyrCSS, {"ocean":{},"graticule":{},"coastline":{},"relief":{},"hydro":{},"countries":{},"borders":{},"cities":{}})) s.lyrCSS = null
    if (s.lyrCSS != null) s.lyrCSS = JSON.stringify(s.lyrCSS)
    // RESOLUTION
    s.resType = dicoResType[s.resType]
    if (s.resType == null) s.res = null
    
    let r = recodeKeys(s, dicoKey)
    // return filterObject(r, ([k,v]) => v != null)
    return r
}

export function encodeURL(obj) {

}

// Ajouter à l'url
// si la valeur est null, on supprime le paramètre de l'url
export function addToURL(obj) {
    console.log(obj)
    const params = (new URL(document.location)).searchParams
    Object.entries(obj)
        .map( ([key,value]) => {
            value == null
            ? params.delete(key)
            : params.set(key, value)
        })
    console.log(params.toString())
    history.pushState({}, '', `?${params.toString()}`)
    // history.replaceState(history.state,'',`?${params.toString()}`)
}
