<script>
    import Frame from './Frame.svelte'
    import Layers from './Layers.svelte'
    import Projection from './Projection.svelte'
    import Resolution from './Resolution.svelte'
    import Download from './Download.svelte'
    import Nav from './Nav.svelte'

    export let canRender
</script>

<div id="settings">
    <Frame />

    <Projection />

    <Layers {canRender} />

    <Resolution />

    <Download />
</div>

<Nav />

<style>
    #settings {
        flex: 0 1 var(--settings-width);
        scroll-behavior: smooth;
        overflow-y: scroll;
        overflow: -moz-scrollbars-none;
        padding: 0 1rem 0 1rem;
        background-color:var(--light-grey);
        height: calc(100% - var(--footer-height) - 2rem);
    }
    #settings::-webkit-scrollbar { width: 0 !important; }

    :global(.settings-section){
        min-height: calc(100%);
        padding-top: 1rem;
        display: flex;
        flex-flow: column nowrap;
    }
</style>