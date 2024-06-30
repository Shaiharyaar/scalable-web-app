<script>
  import { tick } from 'svelte';

  export let code;
  export let disabled;

  const handleKeydown = async (event) => {
    if (event.key !== 'Tab') return;

    event.preventDefault();
    const { selectionStart, selectionEnd, value } = event.target;
    code = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);

    await tick();

    event.target.selectionStart = selectionStart + 1;
    event.target.selectionEnd = selectionStart + 1;
  };
</script>

<div class="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
  <label for="coding-textarea" class="sr-only">Coding textarea</label>
  <textarea
    id="coding-textarea"
    rows="4"
    class="w-full min-h-52 px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 [&:has(:focus-visible)]:outline-none dark:text-white dark:placeholder-gray-400"
    placeholder="Write your code here ..."
    required
    bind:value={code}
    on:keydown={handleKeydown}
    {disabled}
  ></textarea>
</div>
