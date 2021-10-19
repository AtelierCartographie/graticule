<script>
    export let message
</script>


<div class="tip">
    <p>{message}</p>
</div>

<style>
    .tip { 
        /* margin: 1rem; */
        box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
    }
    .tip p {
        padding: 1rem;
        background: white;
        font-size: var(--text-medium);
        color: var(--dark-grey);
    }
</style>