<script>
  import { userUuid } from '../stores/stores';
  import { onMount, onDestroy } from 'svelte';
  import GradingButton from './GradingButton.svelte';
  import TextArea from './CodingArea.svelte';
  import AssignmentSelection from './AssignmentSelection.svelte';

  let code = '';
  let assignment;
  let source;

  let pending = false;

  $: if (assignment) {
    console.log('assignment selected');
  }

  onMount(() => {
    console.log({ userUuid: $userUuid });
    source = new EventSource(`/sse/?user=${$userUuid}`);

    source.onmessage = (e) => {
      console.log(e.data);
    };
  });

  onDestroy(() => {
    source.close();
  });

  const pingEventServer = async () => {
    await fetch('/sse/ping');
  };

  const submitCode = async () => {
    if (!assignment) {
      alert('No assignment chosen');
      return;
    }
    const data = {
      assignmentNumber: assignment.assignment_order,
      code,
    };

    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: $userUuid,
      },
      body: JSON.stringify(data),
    });

    if (response.status !== 200) {
      alert('submission rejected; you might have pending submissions');
      return;
    }
    pending = true;
  };
</script>

<div class="flex flex-col gap-2">
  <button on:click={pingEventServer}> Ping me! </button>
  <AssignmentSelection bind:assignment />
  {#if assignment}
    <div class="flex flex-row gap-5">
      <div class="flex flex-col gap-2">
        <h5 class="font-bold mt-4">Assignment:</h5>
        <p id="assignment-handout">{assignment.handout}</p>
      </div>
      <div class="flex flex-col gap-2 w-full">
        <TextArea bind:code disabled={pending} />
        <GradingButton {submitCode} disabled={pending}>Submit</GradingButton>
      </div>
    </div>
  {/if}
</div>
