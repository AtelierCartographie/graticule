<script>
    import Frame from './Frame.svelte'
    import Layers from './Layers.svelte'
    import Projection from './Projection.svelte'
    import Resolution from './Resolution.svelte'
    import Download from './Download.svelte'

    export let canRender
</script>

<div id="settings">
    <Frame />
    <a href="#projection" class="next-section fontTitle">
        <p>continuer</p>
        <p><span class="material-icons">expand_more</span></p>
    </a>

    <Projection />
    <a href="#layers" class="next-section fontTitle">
        <p>continuer</p>
        <p><span class="material-icons">expand_more</span></p>
    </a>

    <Layers {canRender} />
    <a href="#resolution" class="next-section fontTitle">
        <p>continuer</p>
        <p><span class="material-icons">expand_more</span></p>
    </a>

    <Resolution />
    <a href="#download" class="next-section fontTitle">
        <p>continuer</p>
        <p><span class="material-icons">expand_more</span></p>
    </a>

    <Download />
    <a class="next-section fontTitle" style="visibility: hidden;">
        <p>continuer</p>
        <p><span class="material-icons">expand_more</span></p>
    </a>
</div>


<style>
    #settings {
        flex: 0 1 var(--settings-width);
        scroll-behavior: smooth;
        overflow-y: scroll;
        overflow: -moz-scrollbars-none;
        padding: 0 1rem 0 1rem;
        background-color:var(--light-grey);
        height: calc(100% - var(--footer-height));
    }
    #settings::-webkit-scrollbar { width: 0 !important; }

    :global(.settings-section){
        margin-bottom: var(--step-gap);
        min-height: calc(100% - 12rem);
        padding-top: 1rem;
        display: flex;
        flex-flow: column nowrap;
    }

    a.next-section {
        text-decoration: none;
        text-align: center;
        color: var(--dark-grey);
    }
    a.next-section p { margin: 0; }
    a.next-section .material-icons { font-size: 54px; }
    a.next-section:hover,
    a.next-section:hover .material-icons { color: var(--accent-color); }

    /* #settings::after {
        content: "";
        position: fixed;
        width: calc(var(--settings-width) + 2rem);
        left: 0;
        bottom: var(--footer-height);
        height: 4rem;
        background: linear-gradient(to bottom,rgba(249, 249, 249, 0) 0%,rgba(249, 249, 249, .7) 50%,rgba(249, 249, 249, 1) 100%);
    } */
</style>