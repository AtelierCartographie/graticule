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
        /* border: 1px solid var(--dark-grey); */
        margin-top: 0;
        padding: 0;
        background: transparent;
        font-size: var(--text-medium);
        font-style: italic;
        color: var(--dark-grey);
    }
</style>