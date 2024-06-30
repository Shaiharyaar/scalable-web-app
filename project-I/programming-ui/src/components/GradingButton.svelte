<script>
  export let submitCode;
  export let disabled;
</script>

<button
  class="bg-green-500 hover:bg-green-700 text-white font-bold p-4 rounded disabled:bg-gray-500"
  {disabled}
  on:click={submitCode}
>
  <slot />
</button>
