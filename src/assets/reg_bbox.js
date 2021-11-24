const reg_bbox = [
    { id: null, name: "-", bbox: null },
    { id: "africa", name: "Afrique", bbox: { "type": "Feature", "geometry": { "type": "Polygon",
        "coordinates": [[ [-25, -35], [-25, 35], [50, 35], [50, -35], [-25, -35] ]] }} },
    { id: "am_lat", name: "Amérique latine", bbox: { "type": "Feature", "geometry": { "type": "Polygon",
        "coordinates": [[ [-100, -55], [-120, 33], [-30, 30], [-30, -55], [-100, -55] ]] }} },
    { id: "am_nord", name: "Amérique du Nord", bbox: { "type": "Feature", "geometry": { "type": "Polygon",
        "coordinates": [[ [-170, 25], [-170, 70], [-50, 70], [-50, -25], [-170, 25] ]] }} },
    { id: "asia", name: "Asie", bbox: { "type": "Feature", "geometry": { "type": "Polygon",
        "coordinates": [[ [55, -10], [55, 60], [150, 60], [150, -10], [55, -10] ]] }} },
    { id: "europe", name: "Europe", bbox: { "type": "Feature", "geometry": { "type": "Polygon",
        "coordinates": [[ [-15, 30], [-15, 60], [40, 60], [40, 30], [-15, 30] ]] }} },
    { id: "mid_east", name: "Moyen-Orient", bbox: { "type": "Feature", "geometry": { "type": "Polygon",
        "coordinates": [[ [30, 10], [30, 45], [60, 45], [60, 10], [30, 10] ]] }} },
    { id: "oceania", name: "Océanie", bbox: { "type": "Feature", "geometry": { "type": "Polygon",
        "coordinates": [[ [110, -50], [110, 30], [180, 30], [180, -50], [110, -50] ]] }} }
]

export default reg_bbox