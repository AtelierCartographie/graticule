import {geoAzimuthalEqualArea,
        geoMercator,
        geoEqualEarth,
        geoEquirectangular,
        geoOrthographic } from 'd3-geo'
import {geoArmadillo,
        geoBertin1953,
        geoBonne,
        geoMollweide,
        geoNaturalEarth2,
        geoInterruptedMollweide,
        geoInterruptedMollweideHemispheres,
        geoSatellite } from 'd3-geo-projection'
import {geoAirocean } from 'd3-geo-polygon'

const params = [
    {id: "equalEarth", fn: geoEqualEarth(), lambda: 0, phi: 0, gamma: 0},
    {id: "naturalEarth2", fn: geoNaturalEarth2(), lambda: 0, phi: 0, gamma: 0},
    {id: "armadillo", fn: geoArmadillo(), lambda: -10, phi: NaN, gamma: NaN, parallel: 20},
    {id: "bertin53", fn: geoBertin1953(), lambda: -16, phi: -42, gamma: 0},
    {id: "bonne", fn: geoBonne(), lambda: 0, phi: 0, gamma: 0, parallel: 45},
    {id: "orthographic", fn: geoOrthographic(), lambda: 15, phi: -40, gamma: 0},
    {id: "interruptedMollweide", fn: geoInterruptedMollweide(), lambda: 0, phi: 0, gamma: 0},
    {id: "atlantis", fn: geoMollweide(), lambda: 30, phi: -45, gamma: 90},
    {id: "satellite", fn: geoSatellite(), lambda: 0, phi: 0, gamma: 0, distance: 35786, tilt: 0},
    {id: "mercator", fn: geoMercator(), lambda: 0, phi: 0, gamma: 0},
    {id: "equirectangular", fn: geoEquirectangular(), lambda: 0, phi: 0, gamma: 0},
    {id: "mollweideHemisphere", fn: geoInterruptedMollweideHemispheres(), lambda: 20, phi: 0, gamma: 0},
    {id: "laea", fn: geoAzimuthalEqualArea(), lambda: 0, phi: -89, gamma: 0},
//     {name: "Fuller (Airocean)", top: false, fn: geoAirocean(), lambda: -83.65929, phi: 25.44458, gamma: -87.45184},
]


const list = [
        {id: "equalEarth", name: "Equal Earth", top: true, type: 'Pseudo-cylindrique', scale: "Globale", area: 3, distance: 1, angle: 1,
        description: "Inspirée de la projection Robinson, cette projection a été récemment mise au point pour la réalisation de planisphères. La projection a pour principal avantage de représenter correctement les surfaces. Avec ses paramètres standards, le méridien central et les parallèles figurent sous forme de lignes droites. Les méridiens sont par ailleurs représentés avec un espacement régulier."},
        
        {id: "naturalEarth2", name: "Natural Earth 2", top: false, type: 'Pseudo-cylindrique', scale: "Globale", area: 2, distance: 3, angle: 1,
        description: "Développée récemment et moins classique dans sa conception, cette projection tente de réduire la déformation générale.Le compromis de cette projection affecte alors la bonne représentation des surfaces, des distances et des angles.Le méridien central et parallèles sont représentés en lignes droites. Les autres méridiens sont courbés et équidistants. Les parallèles s'éloignent vers les hautes latitudes."},
        
        {id: "armadillo", name: "Armadillo", top: false, type: 'Autre', scale: "Globale", area: 1, distance: 0, angle: 1,
        description: "Moins commune, cette projection donne une impression de vue perspective. La projection tente de réduire la place des mers et océans pour mettre en valeur les continents. Avec ses paramètres standards, elle a pour inconvénient de masquer certaines parties du globe comme la Nouvelle Zélande."},
        
        {id: "bertin53", name: "Bertin 1953", top: true, type: 'Autre', scale: "Globale", area: 2, distance: 1, angle: 0,
        description: "Conçue par le français Jacques Bertin, cette projection a été initialement dessinée à la main. Elle a pour but principal de ne pas déformer la surface des continents et la forme des pays. La distorsion majeure s'opère alors davantage sur les mers et océans. La projection a également pour avantage de ne pas déformer le pôle Nord."},
        
        {id: "bonne", name: "Bonne", top: false, type: 'Pseudo-conique', scale: "Globale", area: 1, distance: 1, angle: 0,
        description: "Populaire avec sa forme de cœur, cette projection est davantage utilisée pour son aspect graphique. Les surfaces, les distances et les angles sont particulièrement déformés. Avec ses paramètres standards, le méridien central est représenté sous forme de ligne droite et les autres méridiens en courbes concaves, à distance égale vers le méridien central."},

        {id: "orthographic", name: "Orthographique", top: true, type: 'Azimutale', scale: "Régionale", area: 1, distance: 1, angle: 1,
        description: "Souvent utilisée pour des cartes dites de situation et à petite échelle, cette projection représente la Terre vue de l'espace. Les surfaces, les distances et les angles sont fortement déformés mis à part le centre de la carte qui lui subit une moindre distorsion."},

        {id: "interruptedMollweide", name: "Mollweide interrompue", top: false, type: 'Pseudo-cylindrique', scale: "Globale ou régionale", area: 3, distance: 1, angle: 0,
        description: "Variante de la projection Mollweide, cette projection dite 'interrompue' permet de réduire la déformation des continents.Les océans et certaines terres sont découpés, cependant la surface est correctement représentée.Plusieurs méridiens centraux disjoints répartis dans les deux hémisphères permettent de réduire cette distorsion."},

        {id: "atlantis", name: "Atlantis", top: false, type: 'Pseudo-cylindrique', scale: "Globale", area: 3, distance: 1, angle: 0,
        description: "Dérivée de la projection Mollweide (version oblique), cette projection permet de mettre en valeur les continents dans un espace resserré. Les surfaces des terres sont comparables grâce à cette projection, les mers et océans sont en revanche mal représentés."},

        {id: "satellite", name: "Satellite", top: false, type: 'Autre', scale: "Régionale ou locale", area: 1, distance: 1, angle: 1,
        description: "Pouvant s'apparenter à la projection orthographique, cette projection a pour particularité de représenter la Terre en simulant une vue de l'espace, avec un angle d'inclinaison visant le centre du globe.Les surfaces, les distances et les angles sont particulièrement déformés excepté le centre de la carte."},

        {id: "mercator", name: "Mercator", top: false, type: 'Cylindrique', scale: "Régionale ou locale", area: 0, distance: 0, angle: 3,
        description: "Probablement la plus célèbre, cette projection a d'abord été utilisée pour la navigation maritime. Elle a plus récemment été largement employée pour les cartes interactives sur le web. Les angles sont parfaitement représentés, en dépit des surfaces et des distances hormis le long de l'équateur. Les méridiens forment des lignes droites équidistantes, tout comme les parallèles qui eux s'éloignent aux pôles."},

        {id: "equirectangular", name: "Plate Carrée", top: true, type: 'Cylindrique', scale: "Régionale ou locale", area: 1, distance: 3, angle: 1,
        description: "Très ancienne et très utilisée dans le passé, cette projection est facilement identifiable avec sa grille régulière de méridiens et de parallèles. Les distances sont ainsi parfaitement conservées, contrairement aux surfaces et aux angles qui sont fortement déformés. Les parallèles et les méridiens sont représentés sous formes de lignes droites et espacés de façon régulière."},

        {id: "mollweideHemisphere", name: "Mollweide interrompue en 2 hémisphères", top: false, type: 'Pseudo-cylindrique', scale: "Globale", area: 3, distance: 1, angle: 0,
        description: "Dérivée de la projection Mollweide, cette projection interrompue découpe le globe en deux hémisphères au sein de deux cercles.Les surfaces sont fidèlement représentées, contrairement aux angles. Le découpage en deux hémisphères permet néanmoins de réduire la distorsion globale.La projection Mollweide est utilisée dans chaque hémisphère composée d'un méridien central en forme de ligne droite. Les autres méridiens prennent une forme concave autour du méridien central, répartis à distance égale, exceptés ceux aux extrémités des hémisphères."},

        {id: "laea", name: "Lambert azimutale équivalente (LAEA)", top: false, type: 'Azimutale', scale: "Globale ou régionale", area: 3, distance: 1, angle: 0,
        description: "Couramment utilisée avec un centrage polaire (et populaire notamment grâce au logo de l'ONU). Les surfaces sont correctement représentées, contrairement aux angles et aux distances. La projection représente, avec ses paramètres standards, les parallèles en cercles et les méridiens en lignes droites."},
    ]

// trie les projections par nom
const listSort = list.sort( (a,b) => a.name.localeCompare(b.name))

export { params, listSort }
