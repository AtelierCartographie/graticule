<script>
    import { geoGraticule10 } from 'd3-geo'
    // couches du fond de carte (topojson > geojson)
    import geo from '../../assets/geo.js'

    export let path, outline


</script>

{#if geo}
    <g id='basemap' style="clip-path: url(#clip)">

        <path id="ocean" d="{path(outline)}" style="visibility: hidden"/>
        <path id='graticule' d="{path(geoGraticule10())}" style="visibility: hidden"></path>

        {#each Object.entries(geo) as [name, fn]}

            <path id='{name}' d="{path(fn)}" style="visibility: hidden"></path>

        {/each}
    </g>
{/if}