<script>
  import { onDestroy, onMount } from 'svelte';
  import { userUuid } from '../stores/stores';

  let question;
  let answersList = [];

  const getAnswersList = async (questionId) => {
    const response = await fetch(`/api/questions/${questionId}/answers`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: $userUuid,
      },
    });

    const data = await response.json();
    console.log({ data });
    answersList = data;
  };

  const getAllDetails = () => {
    const data = localStorage.getItem('@questionData');
    if (data) {
      const jsonData = JSON.parse(data);
      console.log({ jsonData });
      question = jsonData;
      getAnswersList(jsonData.question_id);
    } else {
      alert('There was an issue in loading question');
      window.location.href = '/';
    }
  };

  onMount(() => {
    getAllDetails();
  });
</script>

<div>
  <h1>Question</h1>

  {#if question}
    <h4>{question.title}</h4>
    <p>{question.body}</p>
  {/if}

  Answers list

  {#each answersList as answer}
    <div>
      {answer.body}
    </div>
  {/each}
</div>
