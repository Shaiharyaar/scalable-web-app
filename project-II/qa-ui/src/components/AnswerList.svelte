<script>
  import AnswerItem from './AnswerItem.svelte';

  export let answers;
</script>

{#if answers.length > 0}
  <div id={'answer-list-id'} class="flex flex-1 flex-col">
    {#each answers as answer}
      <AnswerItem bind:answer />
    {/each}
  </div>
{/if}
