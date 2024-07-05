<script>
  import { userUuid } from '../stores/stores';
  export let answer;
  let loading = false;

  const upvoteAnswer = async () => {
    loading = true;
    const response = await fetch(
      `/api/questions/${answer.question_id}/answers/${answer.answer_id}/upvote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: $userUuid,
        },
      }
    );

    if (response.status === 200) {
      loading = false;
    }
  };

  const onUpvoteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (answer.user_upvoted) return;
    upvoteAnswer();
  };
</script>

<button class={'flex flex-1 flex-col border-1'} on:click={onQuestionClick}>
  <p>
    {answer.text}
  </p>
  <div class="flex w-full flex-row justify-between">
    <p>Total Upvotes: {answer.total_upvotes}</p>
    <button on:click={onUpvoteClick}>
      <p>{answer.user_upvoted ? 'Upvoted' : 'Upvote'}</p>
    </button>
  </div>
</button>
