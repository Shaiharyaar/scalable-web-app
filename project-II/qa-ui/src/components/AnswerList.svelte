<script>
  import AnswerItem from './AnswerItem.svelte';

  export let answers;
</script>

<div class="flex flex-1 flex-col">
  {#each answers as answer}
    <AnswerItem bind:answer />
  {/each}
</div>
