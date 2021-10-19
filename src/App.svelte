<script>
  import { onMount } from 'svelte'
  import { proj } from './stores.js'

  import { feature } from 'topojson-client'
  import basemap from './assets/basemap.json'

  import Header from './lib/Header.svelte'
  import Settings from './lib/settings/Settings.svelte'
  import Map from './lib/Map.svelte'
  //import Projection from './lib/settings/Projection.svelte'
  import Footer from './lib/Footer.svelte'

  // # DONNÉES DES COMPOSANTS -------
  // ## Map.svelte
  let projection
  const unsubscribe = proj.subscribe(value => { projection = value })
  
  // récupérer les différentes couches du topojson au format geojson
  const geo = {
        land: feature(basemap, basemap.objects.land),
        borders: feature(basemap, basemap.objects.borders),
        borders_disputed: feature(basemap, basemap.objects.borders_disputed),
        urban: feature(basemap, basemap.objects.urban)
    }
  // ------------------------------------------------------

  let canRender = false

  onMount( () => {
    canRender = true
  })
</script>

<Header />
<main id="app">
  <Settings {canRender}/>
  <Map {projection} {geo} />
</main>

<Footer />

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

    --nav-h: 3.5rem;
    --settings-width: 18rem;
    --footer-height: 7rem;
    --step-gap: 6rem;

    --text-big: 16px;
    --text-medium: 14px;
    --text-small: 12px;

    --dark-grey: #4B4B4B;
    --grey: #E5E5E5;
    --light-grey: #F9F9F9;
  }

  :global(body) { margin: 0;}
  :global(h2) {
    font-size: var(--text-big);
    color: var(--dark-grey);
  }
  :global(h3) {
    font-size: var(--text-medium);
    color: var(--dark-grey);
  }

  main {
    /* display: flex; */
    /* flex-direction: row; */
  }
</style>
