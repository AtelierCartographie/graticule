<script>
    import { modalContent, isModalOpen } from '../stores.js'
</script>

<footer>
    <div id="logo">
        <a href="https://www.sciencespo.fr/cartographie/" title="Sciences Po - Atelier de cartographie">
            <img src="./logo-Atelier-NB.svg" width="144" height="37" alt="Logo de Sciences Po - Atelier de cartographie">
        </a>
    </div>
    <div>
        <p id='about'
            on:click={() => modalContent.set('about')}
            on:click={isModalOpen.set(!$isModalOpen)}>
        À propos</p>
        <p id="version">v1</p>
    </div>
    
</footer>

<style>
    footer {
        position: fixed;
        bottom: 0;
        width: var(--settings-width);
        padding: 1rem;
        /* border-top: 1px solid #ccc; */
        z-index: 10;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        background-color:var(--light-grey);
    }
    #logo {
        width: 10rem;
    }
    p {
        margin: 0;
    }
    #about { text-decoration: underline; }
    #about:hover { cursor: help; }
    footer p { 
        font-size: var(--text-small);
        color: var(--dark-grey);
    }
</style>