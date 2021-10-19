<script>
    import Layers from './Layers.svelte'
    import Projection from './Projection.svelte'
    // import Download from '../Download.svelte'

    export let canRender

  // ## Layers.svelte
  const layers_list = {
    "Ocean": "ocean",
    "Graticule": "graticule",
    "Land": "land",
    "Borders": "borders",
    "Borders disputed": "borders_disputed",
    "Urban centre": "urban"
  }
  let lyr_selected = ['ocean', 'land']

</script>

<div id="settings">
    <Projection />
    {#if canRender}
    <Layers {layers_list} {lyr_selected} />
    {/if}
    <!-- <Download /> -->
</div>


<style>
    #settings {
        position: fixed;
        width: 18rem;
        overflow-y: scroll;
        overflow: -moz-scrollbars-none;
        top: var(--nav-h);
        bottom: 0;
        padding: 1rem;
        /* height: 100vh; */
        /* margin-top: var(--nav-h); */
        /* flex-grow: 0;
        flex-shrink: 0;
        flex-basis: 300px; */
        /* display: flex;
        flex-direction: column; */
        background-color:var(--light-grey);
    }
    #settings::-webkit-scrollbar { width: 0 !important; }
</style>