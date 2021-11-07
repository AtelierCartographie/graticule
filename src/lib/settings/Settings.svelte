<script>
    import { select } from 'd3-selection'
    import Frame from './Frame.svelte'
    import Layers from './Layers.svelte'
    import Projection from './Projection.svelte'
    import Resolution from './Resolution.svelte'
    import Download from './Download.svelte'

    export let canRender

</script>

<div id="settings">
    <Frame />
    <Projection />
    <Layers {canRender} />
    <Resolution />
    <!-- <section id="layout" class="settings-section">
        <h2><span class="material-icons">grid_3x3</span> Mise en page</h2>
        <a href="#download" class="next-section"><span class="material-icons">expand_more</span></a>
    </section> -->
    <Download />
    
</div>


<style>
    #settings {
        flex: 0 1 var(--settings-width);
        scroll-behavior: smooth;
        overflow-y: scroll;
        overflow: -moz-scrollbars-none;
        padding: 0 1rem 0 1rem;
        background-color:var(--light-grey);
    }
   
    #settings::-webkit-scrollbar { width: 0 !important; }
    /* #settings::after {
        content: "";
        position: fixed;
        width: calc(var(--settings-width) + 2rem);
        left: 0;
        bottom: var(--footer-height);
        height: 4rem;
        background: linear-gradient(to bottom,rgba(249, 249, 249, 0) 0%,rgba(249, 249, 249, .7) 50%,rgba(249, 249, 249, 1) 100%);
    } */

    :global(.settings-section){
        margin-bottom: var(--step-gap);
        height: 80%;
        padding-top: 1rem;
        display: flex;
        flex-flow: column nowrap;
        flex: 1;
    }
    :global(.settings-section a.next-section) {
        align-self: center;
        margin-top: auto;
        text-decoration: none;
        /* color: var(--dark-grey); */
    }
    :global(.settings-section a.next-section .material-icons) {
        font-size: 54px;
        color: var(--dark-grey);
    }
    :global(.settings-section a.next-section .material-icons:hover) {
        color: var(--accent-color);
    }
</style>