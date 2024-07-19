<script>
  import AnswerItem from './AnswerItem.svelte';

  export let answers;
</script>

{#if answers.length > 0}
  <div id={'answer-list-id'} class="flex flex-1 flex-col gap-5 p-10">
    <h3
      class="text-2xl font-bold tracking-tight text-gray-600 px-5 border-b-2 pb-3"
    >
      Answers
    </h3>
    {#each answers as answer}
      <AnswerItem bind:answer />
    {/each}
  </div>
{/if}
