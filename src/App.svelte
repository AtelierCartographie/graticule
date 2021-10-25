<script>
  import { onMount } from 'svelte'
  import Header from './lib/Header.svelte'
  import Settings from './lib/settings/Settings.svelte'
  import Map from './lib/map/Map.svelte'
  import Footer from './lib/Footer.svelte'

  let canRender = false
  onMount( () => {
    canRender = true
  })
</script>

<Header />
<main id="app">
  <Settings {canRender} />
  <Map />
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
    --light-grey: #f9f9f9;

    --accent-color: #ff3b00;
    --accent-color-light: #ffd8cc;
  }

  :global(body) { margin: 0;}
  :global(h2) {
    margin-bottom: 0.5rem;
    font-size: var(--text-big);
    color: var(--dark-grey);
  }
  :global(h3) {
    font-size: var(--text-medium);
    color: var(--dark-grey);
  }

  :global(input) {
    accent-color: var(--accent-color);
  }

  /* PICTOGRAMME MATERIAL ICONS */
@font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: local('Material Icons'),
      local('MaterialIcons-Regular'),
      url("./MaterialIcons-Regular.woff2") format('woff2');
  }

  :global(.material-icons) {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;  /* Preferred icon size */
    display:inline-flex;
    vertical-align:middle;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
  }

  main {
    /* display: flex; */
    /* flex-direction: row; */
  }
</style>
