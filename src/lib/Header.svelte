<script>
   
</script>


<header role="banner">
    <nav role="navigation" id="topbar">
        <h1><a href="./" on:click={() => sessionStorage.clear()}>Graticule</a></h1>
        <ol class="fontTitle">
            <li id="headerFrame" class="navSteps inView"> <a href="#frame" class="header-steps"><span class="material-icons">crop</span> Cadrer</a> </li>
            <li id="headerProjection" class="navSteps"> <a href="#projection"class="header-steps" ><span class="material-icons">language</span> Projeter</a> </li>
            <li id="headerLayers" class="navSteps"> <a href="#layers" class="header-steps"><span class="material-icons">layers</span> Personnaliser</a> </li>
            <li id="headerResolution" class="navSteps"> <a href="#resolution" class="header-steps"><span class="material-icons">timeline</span> Simplifier</a> </li>
            <li id="headerDownload" class="navSteps"> <a href="#download" class="header-steps"><span class="material-icons">file_download</span> Télécharger</a> </li>
        </ol>
    </nav>
</header>

<style>
    #topbar { 
        /* position: fixed; */
        top: 0;
        width: 100vw;
        height: var(--nav-h);
        display: flex;
        align-items: center;
        background-color: white;
        background-color: white;
        box-shadow: 0 4px 4px rgb(0 0 0 / 6%);
        border-bottom: 1px solid #ccc;
        z-index: 10;
    }
    #topbar ol {
        list-style-type: none;
        padding: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 1rem;
        margin: 0 1rem;
    }
    #topbar h1 { 
        text-align: center;;
        width: calc(var(--settings-width) + 2rem) ;
    }
    #topbar h1 a {
        all: inherit;
        cursor: pointer;
    }
    #topbar li {
        font-size: var(--text-medium);
        font-weight: bold;
        background-color: var(--light-grey);
        border: 1px solid var(--dark-grey);
        /* padding: .5rem 1rem .5rem .5rem; */
        border-radius: 2em;
        padding: .3rem .7rem;
    }
    a.header-steps {
        display: block;
        text-decoration: none;
        color: var(--dark-grey);
    }
    #topbar li.inView, #topbar li.inView a.header-steps, #topbar li:hover, #topbar li:hover a.header-steps {
        background-color: var(--accent-color-light);
        color: var(--accent-color);
    }
    #topbar li.inView, #topbar li:hover {
        border: 1px solid var(--accent-color);
    }

    @media (max-width: 1040px) {
        #topbar li { font-size: var(--text-small); } 
        .material-icons { font-size: 18px; }
    }
    @media (max-width: 950px) {
        #topbar ol { gap: .5rem; margin: 0 .5rem; }
    }
</style>