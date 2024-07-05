<script>
  import QuestionItem from './QuestionItem.svelte';
  import { questions } from '../stores/stores';
</script>

<div class="flex flex-1 flex-col">
  {#each $questions as question}
    <QuestionItem bind:question />
  {/each}
</div>
