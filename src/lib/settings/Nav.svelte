<script>
    import { stepActive } from '../../stores.js'
    import tooltip from '../js/tooltip.js'

    let nextStep
    $: {
        switch ($stepActive) {
            case 'headerFrame':
                nextStep = '#projection'
                break
            case 'headerProjection': 
                nextStep = '#layers'
                break
            case 'headerLayers':
                nextStep = '#resolution'
                break
            case 'headerResolution':
                nextStep = '#download'
                break
            case 'headerDownload':
                nextStep = null
                break
        }
    }

</script>

<div id="navSettings">
    <a href="./" on:click={() => sessionStorage.clear()}
       class="restart fontTitle"
       use:tooltip={{placement: 'top', theme: 'grey'}} title="Efface tous les choix faits">
        <p>Recommencer</p>
    </a>
    
    {#if nextStep != null}
    <a href={nextStep} class="next fontTitle">
        <p>Continuer</p>
    </a>
    {/if}
</div>


<style>
    #navSettings {
        position: fixed;
        bottom: var(--footer-height);
        width: var(--settings-width);
        height: 2rem;
        padding: 1rem;
        border-top: 1px solid #ccc;
        z-index: 10;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        background-color:var(--light-grey);
    }
    a {
        text-decoration: none;
        text-align: left;
        font-size: var(--text-medium);
        font-weight: bold;
        color: var(--dark-grey);
        border: 1px solid var(--dark-grey);
        border-radius: 2em;
        padding: .3rem .7rem;
    }
    a.next {
        color: var(--accent-color);
        border: 1px solid var(--accent-color);
    }
    a.next:hover {
        background-color: var(--accent-color-light);
    }
    a p { margin: 0; }
    a.restart:hover { 
        background-color: var(--dark-grey);
        color: white;
        border: 1px solid white;
    }
</style>