<script>
  export let submitCode;
  export let disabled;
</script>

<button
  type="submit"
  class="inline-flex items-center py-2.5 px-4 w-full text-xs justify-center font-medium text-center text-white bg-green-700 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900 hover:bg-green-800 disabled:bg-gray-500 disabled:cursor-not-allowed outline-none"
  {disabled}
  on:click={submitCode}
>
  <slot />
</button>
