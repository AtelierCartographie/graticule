<script>
    import Frame from './Frame.svelte'
    import Layers from './Layers.svelte'
    import Projection from './Projection.svelte'
    import Resolution from './Resolution.svelte'
    import Download from '../Download.svelte'

    export let canRender
</script>

<div id="settings">
    <Frame />
    <Projection />
    <Layers {canRender} />
    <Resolution />
    <section id="download">
      <Download />
    </section>
    
</div>


<style>
    #settings {
        position: fixed;
        width: var(--settings-width);
        overflow-y: scroll;
        overflow: -moz-scrollbars-none;
        top: var(--nav-h);
        bottom: var(--footer-height);
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
    #settings::after {
      content: "";
      position: fixed;
      width: calc(var(--settings-width) + 2rem);
      left: 0;
      bottom: var(--footer-height);
      height: 4rem;
      background: linear-gradient(to bottom,rgba(249, 249, 249, 0) 0%,rgba(249, 249, 249, .7) 50%,rgba(249, 249, 249, 1) 100%);
    }
    #download {
        margin-bottom: var(--step-gap);
    }
</style>