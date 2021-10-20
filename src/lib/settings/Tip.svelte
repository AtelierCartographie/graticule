<script>
    export let message
</script>


<div class="tip">
    <p>{message}</p>
</div>

<style>
    .tip { 
        /* margin: 1rem; */
        /* box-shadow: 0 4px 4px rgb(0 0 0 / 25%); */
        
    }
    .tip p {
        border: 1px solid var(--dark-grey);
        padding: 0.5rem;
        background: transparent;
        font-size: var(--text-medium);
        color: var(--dark-grey);
    }
</style>