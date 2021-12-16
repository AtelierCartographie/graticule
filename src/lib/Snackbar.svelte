<script>
    import { showSnackbar } from '../stores.js'
    import { slide } from "svelte/transition"

    $: if ($showSnackbar.state == 'loaded')  {
        setTimeout(() => { 
            showSnackbar.set({state: null, message: null}); },
            2000)
    }
</script>

<div class="snackbar-back">
    {#if $showSnackbar.state == 'loading'}
    <div id="snackbar" class="layerLoading" transition:slide={{ duration: 300 }}>
        <span class="material-icons">sync</span>
        {$showSnackbar.message}
    </div>
    {:else if $showSnackbar.state == 'loaded'}
    <div id="snackbar" class="layerLoaded" transition:slide={{ duration: 300 }}>
        <span class="material-icons">task_alt</span>
        {$showSnackbar.message}
    </div>
    {/if}
</div>


<style>
.snackbar-back {
    display: flex;
    align-items: center;
    justify-content: center;
}
#snackbar {
    min-width: 200px;
    border-radius: 2em;
    padding: .3rem .7rem;
    box-shadow: 0 2px 2px rgb(0 0 0 / 30%);
    
    background-color: var(--light-grey);
    color: var(--dark-grey);

    text-align: center;
    font-size: var(--text-medium);
  
    position: fixed;
    top: calc(var(--nav-h) + 1rem);
}
#snackbar.layerLoaded {
    background-color: var(--accent-color-light);
    color: var(--accent-color-dark);
}

.layerLoading .material-icons { animation: 10s linear infinite loop;}
@keyframes loop { from { transform: rotate(0deg); } to { transform: rotate(3600deg); }  }
</style>