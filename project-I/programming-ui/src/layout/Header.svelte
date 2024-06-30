<script>
  import Points from '../components/Points.svelte';
  import { userUuid } from '../stores/stores.js';
</script>

<nav class="flex flex-row justify-between p-4 mb-4 shadow">
  <span class="text-2xl text-gray-700 font-serif">Hello {$userUuid}!</span>
  <Points />
</nav>
