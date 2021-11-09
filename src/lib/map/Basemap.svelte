<script>
    import { blur } from "svelte/transition";
    import { geoGraticule10 } from 'd3-geo'
    import geo from '../../assets/geo.js' // couches du fond de carte (topojson > geojson)

    export let path, outline

    // Par défaut les transitions ne se font qu'à l'apparition/création de l'élément dans le DOM
    // pour les activers quand une valeur de variable change il faut utiliser #key
    // https://svelte.dev/tutorial/key-blocks
</script>

{#if geo}
    <g id='basemap' style="clip-path: url(#clip)">

        <path id="ocean" d="{path(outline)}" transition:blur="{{ duration: 1500 }}" style="visibility: hidden"/>
        <path id='graticule' d="{path(geoGraticule10())}" style="visibility: hidden"></path>

        {#each Object.entries(geo) as [name, fn]}

            <path transition:blur="{{ duration: 1500}}" id='{name}' d="{path(fn)}" style="visibility: hidden"></path>

        {/each}
    </g>
{/if}