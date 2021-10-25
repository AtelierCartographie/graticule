<script>

</script>


<header role="banner">
    <nav role="navigation" id="topbar">
        <h1>#Cartofond</h1>
        <ol>
            <li><span class="material-icons">crop</span> Cadrer</li>
            <li><span class="material-icons">language</span> Projeter</li>
            <li><span class="material-icons">layers</span> Alimenter</li>
            <li><span class="material-icons">timeline</span> Simplifier</li>
            <li><span class="material-icons">grid_3x3</span> Mettre en page</li>
        </ol>
        <button>Télécharger</button>
    </nav>
</header>

<style>
    #topbar { 
        position: fixed;
        top: 0;
        width: 100vw;
        height: var(--nav-h);
        /* padding: 0 10px 0 10px; */
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: white;
        background-color: white;
        box-shadow: 0 4px 4px rgb(0 0 0 / 6%);
        border-bottom: 1px solid #ccc;
        z-index: 10;
    }
    #topbar ol {
        display: flex;
        list-style-type: none;
        padding: 0;
        align-items: center;
        justify-content: space-between;
    }
    #topbar h1 { 
        text-align: center;;
        width: 300px;
    }
    #topbar li {
        font-size: var(--text-medium);
        font-weight: bold;
        color: var(--dark-grey);
        background-color: var(--light-grey);
        padding: 0.5rem;
        margin: 0 1rem;
    }
    #topbar button {
        right: 0;
    }
</style>