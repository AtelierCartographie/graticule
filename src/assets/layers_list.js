const layers_list = [
    {id: "ocean", name: "Mers et océans", type: "geo", style: ["fill", "stroke"] },
    {id: "graticule", name: "Méridiens/parallèles", type: "geo", style: ["stroke"] },
    {id: "coastline", name: "Côtes", type: "geo", style: ["stroke"] },
    {id: "countries", name: "Pays", type: "human", style: ["fill"] },
    {id: "relief", name: "Relief", type: "geo", style: ["fill"] },
    {id: "borders", name: "Frontières", type: "human", style: ["stroke"] },
    {id: "hydro", name: "Lacs et rivières", type: "geo", style: ["stroke"] },
    {id: "cities", name: "Villes", type: "human", style: ["fill", "stroke"] }
    // {id: "urban", name: "Zones urbaines", type: "human", style: ["fill", "stroke"] }
]
export default layers_list