<script>
  import { userUuid, setAssignmentsStore } from '../stores/stores';
  import { onMount, onDestroy } from 'svelte';
  import GradingButton from './GradingButton.svelte';
  import CodingTextarea from './CodingTextarea.svelte';
  import AssignmentSelection from './AssignmentSelection.svelte';

  const successFeedback = 'Your submission is correct!';
  let code = '';
  let assignment;
  let source;
  let showFeedback = false;
  let feedback = '';

  let pending = false;

  onMount(() => {
    source = new EventSource(`/sse/?user=${$userUuid}`);

    source.addEventListener('submission_results', async (e) => {
      pending = false;
      const obj = JSON.parse(event.data);
      if (obj.correct) {
        showFeedback = true;
        feedback = successFeedback;
        await setAssignmentsStore();
        return;
      }
      showFeedback = true;
      feedback = obj.grader_feedback;
    });
    source.addEventListener('init', (e) => {
      pending = false;
      console.log('server result message: ', e.data);
    });
  });

  onDestroy(() => {
    source.close();
  });

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

  const hideFeedback = () => {
    showFeedback = false;
    feedback = '';
  };
</script>

<div class="flex flex-col gap-10">
  <AssignmentSelection bind:assignment />

  {#if assignment}
    <div class="flex lg:flex-row flex-col gap-5">
      <div class="flex flex-col gap-2">
        <h5 class="font-bold mt-4">Assignment:</h5>
        <p id="assignment-test-container">{assignment.handout}</p>
      </div>
      <div class="flex flex-col gap-2 w-full">
        <CodingTextarea bind:code disabled={pending} />
        <GradingButton {submitCode} disabled={pending}>Submit</GradingButton>
        {#if showFeedback}
          <code
            id="submission-feedback-container"
            class={`relative ${feedback == successFeedback ? 'bg-green-500' : 'bg-red-500'} mt-2 text-white p-4 rounded-xl`}
          >
            <button
              class="absolute top-3 right-3 z-10 cursor-pointer"
              on:click={hideFeedback}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                fill="#fff"
                height="14"
                width="14"
                version="1.1"
                id="Layer_1"
                viewBox="0 0 512 512"
                xml:space="preserve"
              >
                <g>
                  <g>
                    <polygon
                      points="512,59.076 452.922,0 256,196.922 59.076,0 0,59.076 196.922,256 0,452.922 59.076,512 256,315.076 452.922,512     512,452.922 315.076,256   "
                    />
                  </g>
                </g>
              </svg>
            </button>

            {#if feedback != successFeedback}
              Your submission was incorrect <br />
            {/if}
            {feedback}
          </code>
        {/if}
      </div>
    </div>
  {/if}
</div>
