<script>
  import QuestionItem from './QuestionItem.svelte';
  import { questions } from '../stores/stores';

  console.log({ questions: $questions });
</script>

<div class="flex flex-1 flex-col">
  {#each $questions as question}
    <QuestionItem bind:question />
  {/each}
</div>
