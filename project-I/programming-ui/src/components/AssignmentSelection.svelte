<script>
  import { assignments } from '../stores/stores';
  export let assignment;

  let nextAssignment;

  $: nextAssignment =
    $assignments.reduce(
      (prev, curr) =>
        curr.assignment_order > prev && curr.completed ? prev + 1 : prev,
      0
    ) + 1;
</script>

<div class="flex flex-wrap gap-x-2">
  <label for="underline_select" class="sr-only">Underline select</label>
  <select
    id="assignment-selection"
    class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
    bind:value={assignment}
  >
    <option value={null} selected> Pick an assignment </option>
    {#each $assignments as a, i}
      <option value={a} disabled={a.assignment_order > nextAssignment}>
        {i + 1}. {a.title}{`${a.completed ? ' (completed)' : ''}`}
      </option>
    {/each}
  </select>
</div>
