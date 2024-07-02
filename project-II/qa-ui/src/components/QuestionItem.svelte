<script>
  import { userUuid } from '../stores/stores';
  export let question;

  const onQuestionClick = () => {
    localStorage.setItem('@questionData', JSON.stringify(question));
    window.location.href = '/question';
  };
  console.log({ question });
</script>

<button class={'flex flex-1 flex-col border-1'} on:click={onQuestionClick}>
  <h4>{question.title}</h4>
  <p>
    {question.body}
  </p>
  <div class="flex w-full flex-row justify-between">
    <p>Total Answers: {question.total_answers}</p>
    <p>Total Upvotes: {question.total_upvotes}</p>
    <p>{question.user_upvoted ? 'Remove Upvote' : 'Upvote'}</p>
  </div>
</button>
