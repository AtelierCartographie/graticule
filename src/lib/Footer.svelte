<script>
    import { modalContent, isModalOpen } from '../stores.js'
    $: console.log($isModalOpen)
</script>

<footer>
    <div id="logo">
        <a href="https://www.sciencespo.fr/cartographie/" title="Sciences Po - Atelier de cartographie">
            <img width="130" src="./logo-Atelier-NB.svg" alt="Logo de Sciences Po - Atelier de cartographie">
        </a>
    </div>
    <div>
        <p id='about'
            on:click={() => modalContent.set('about')}
            on:click={isModalOpen.set(!$isModalOpen)}>
        À propos</p>
        <p id="version">Beta version</p>
    </div>
    
</footer>

<style>
    footer {
        position: fixed;
        bottom: 0;
        width: var(--settings-width);
        padding: 1rem;
        border-top: 1px solid #ccc;
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
    footer img {
        width: 9rem;
    }
</style>