<script>
    import tooltip from '../js/tooltip.js'

    export let onClick,
        classActive = null,
        isTooltip = true,
        tooltipParams = {placement: 'top'},
        title = null,
        text
</script>

{#if isTooltip}
<button on:click={onClick}
    class:active={classActive}
    use:tooltip={tooltipParams}
    title={title} 
    type="button"
    class="badge">
{text}
</button>
{/if}

{#if !isTooltip}
<button on:click={onClick}
    class:active={classActive}
    title={title} 
    type="button"
    class="badge">
{text}
</button>
{/if}

<style>
    .badge {
        display: inline-block;
        /* min-zwidth: 1em; */
        padding: .3rem .5rem;
        border-radius: 2em;
        font-size: var(--text-small);
        text-align: center;
        background: var(--light-grey);
        color: var(--dark-grey);
        border: 1px solid var(--dark-grey);
    }
    .badge.active, .badge:hover {
        background: var(--accent-color-light);
        color: var(--accent-color);
        border: 1px solid var(--accent-color);
    }
</style>