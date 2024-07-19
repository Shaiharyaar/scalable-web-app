<script>
  import QuestionItem from './QuestionItem.svelte';
  import { questions } from '../stores/stores';
</script>

{#if $questions.length > 0}
  <div id={'question-list-id'} class="flex flex-1 flex-col gap-5 p-10">
    {#each $questions as question}
      <QuestionItem bind:question />
    {/each}
  </div>
{/if}
