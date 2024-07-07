<script>
  import { userUuid } from '../stores/stores';
  export let question;
  let loading = false;
  const onQuestionClick = () => {
    localStorage.setItem('@questionData', JSON.stringify(question));
    window.location.href = '/question';
  };

  const upvoteQuestion = async () => {
    loading = true;
    const response = await fetch(
      `/api/questions/${question.question_id}/upvote`,
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
    if (question.user_upvoted) return;
    upvoteQuestion();
  };
</script>

<button
  class={'flex flex-1 flex-col border-1 question-item'}
  on:click={onQuestionClick}
>
  <h4 id={'question-title-id'}>{question.title}</h4>
  <p id={'question-text-id'}>
    {question.text}
  </p>
  <div class="flex w-full flex-row justify-between">
    <p>Total Answers: {question.total_answers}</p>
    <p>Total Upvotes: {question.total_upvotes}</p>
    <button on:click={onUpvoteClick}>
      <p>{question.user_upvoted ? 'Upvoted' : 'Upvote'}</p>
    </button>
  </div>
</button>
