<script>

</script>

<footer>
    <div id="logo">
        <p>Cartofond est un projet open source développé par</p>
        <a href="https://www.sciencespo.fr/cartographie/" title="Sciences Po - Atelier de cartographie">
            <img src="./logo-Atelier-NB.svg" alt="Logo de Sciences Po - Atelier de cartographie">
        </a>
    </div>
    <div id="version">
        <p>version 1.0</p>
    </div>
    
</footer>

<style>
    footer {
        position: fixed;
        bottom: 0;
        width: 18rem;
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
    #version p {
        margin: 0;
    }
    footer p { 
        font-size: var(--text-small);
        color: var(--dark-grey);
    }
    /* footer div {
        flex: 1;
    }
    footer > p {
        flex: 0.5;
    } */
    footer img {
        width: 10rem;
    }
</style>