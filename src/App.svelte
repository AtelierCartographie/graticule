<script>
  import "@fontsource/fira-code/latin-700.css"
  import "@fontsource/open-sans/latin-400.css"
  import "@fontsource/open-sans/latin-400-italic.css"
  import "@fontsource/open-sans/latin-700.css"
  import "@fontsource/open-sans/latin-700-italic.css"
  import "@fontsource/material-icons"
  
  import { onMount } from 'svelte'
  import Header from './lib/Header.svelte'
  import Settings from './lib/settings/Settings.svelte'
  import Map from './lib/map/Map.svelte'
  import Footer from './lib/Footer.svelte'
  import Modal from './lib/UI/Modal.svelte'  
  import Help from './lib/UI/Help.svelte'
  import Snackbar from './lib/UI/Snackbar.svelte'
  import { isModalOpen, modalContent } from "./stores";

  let canRender = false
  let width, height, clientWidth

  // Modal si petit écran (outil non adapté) => cf help/helpScreenSize.md
  $: small = clientWidth < 700 ? true : false
  $: small 
      ? ($modalContent = 'size', $isModalOpen = true)
      : $isModalOpen = false

      
  onMount( () => {
    canRender = true
    width = document.getElementById('svg-container').clientWidth
    height = document.getElementById('svg-container').clientHeight
  })
</script>

<Header />

<main id="app" bind:clientWidth={clientWidth}>

  <Settings {canRender} />

  <figure id="svg-container">
    {#if canRender}
      <Map {width} {height} />
    {/if}
  </figure>

</main>

<Footer />

<Modal>
  <Help />
</Modal>

<Snackbar />

<style>
  :root {
    font-family: "Open sans", sans-serif;

    --nav-h: 3.5rem;
    --content-h: calc(100vh - var(--nav-h) - .5rem);
    --settings-width: 16rem;
    --footer-height: 4rem;

    --text-big: 16px;
    --text-medium: 14px;
    --text-small: 12px;

    --dark-grey: #4B4B4B;
    --grey: #E5E5E5;
    --light-grey: #f9f9f9;

    --accent-color-dark: #BD2C00;
    --accent-color: #ff3b00;
    --accent-color-medium: #ffa98f;
    --accent-color-light: #ffd8cc;
  }

  :global(body) { margin: 0;}

  :global(h1,h2,h3,h4, .fontTitle) {
    font-family: "Fira Code", monospace;
  }
  :global(h2) {
    margin-bottom: 0.5rem;
    font-size: var(--text-big);
    color: var(--dark-grey);
  }
  :global(h3) {
    font-size: var(--text-medium);
    color: var(--dark-grey);
    margin-top: 1rem;
    margin-bottom: .5rem;
  }

  :global(input) {
    accent-color: var(--accent-color);
  }

  main {
    display: flex;
    flex-flow: row nowrap;
    height: var(--content-h);
  }

  #svg-container {
        all: inherit;
        display: block;
        position: relative;
        flex: 1;
        padding: 1rem;
        height: calc(var(--content-h) - 2rem);
    }

  /* -------------------------- */
  /* PICTOGRAMME MATERIAL ICONS */
  :global(.material-icons) {
    display: inline-flex;
    vertical-align: middle;
  }
  /* -------------------------- */

  /* -------------------------- */
  /*  TIPPY.JS TOOLTIP THEMING  */
  :global(.tippy-box[data-theme~='accent']) {
    background-color: var(--accent-color-medium);
    color: var(--dark-grey);
    font-size: var(--text-small)
  }
  :global(.material-icons.tooltip) { font-size: 20px; cursor: help; }
  :global(.material-icons.tooltip:hover) { color: var(--accent-color); }

  :global(.tippy-box[data-theme~='grey']) {
    background-color: var(--dark-grey);
    color: white;
    font-size: var(--text-small)
  }
  /* -------------------------- */
</style>