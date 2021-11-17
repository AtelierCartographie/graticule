<script>
    import { fade } from 'svelte/transition'
    import { isModalOpen } from '../stores.js'

    function closeModal() {
        $isModalOpen = !$isModalOpen
    }
</script>

{#if $isModalOpen}
    <div 
        class="backdrop"
        transition:fade
        on:click={closeModal}
    />

    <div role="dialog" class="modal" transition:fade>
        <div class="contents">
            <button on:click={closeModal}>
                <span class="material-icons">close</span>
            </button>
            <slot></slot>
        </div>
    </div>
{/if}

<style>
    .backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background: rgba(0,0,0,0.50);
        z-index: 100;
    }
    .modal {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;

        /* allow click-through to backdrop */
        pointer-events: none;
    }
    .contents {
        max-height: 80vh;
        overflow-y: auto;
        min-width: 240px;
        border-radius: 6px;
        padding: 16px;
        background: white;
        /* display: flex;
        flex-direction: column;
        justify-content: space-between; */
        pointer-events: auto;
        font-size: var(--text-medium);
    }
</style>