<script>
  import { tick, onDestroy, onMount } from 'svelte';
  import { userUuid } from '../stores/stores';
  import AnswerList from './AnswerList.svelte';
  import Button from './Button.svelte';

  let source;
  let question;
  let answersList = [];
  let pending = false;

  const onAddAnswer = async () => {
    pending = true;
    const data = {
      text: 'This is my answer',
    };

    const response = await fetch(
      `/api/questions/${question.question_id}/answers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: $userUuid,
        },
        body: JSON.stringify(data),
      }
    );

    console.log({ response });
    if (response.status !== 200) {
      alert('question submission rejected');
      return;
    }
  };

  const getAnswersList = async (questionId) => {
    const response = await fetch(`/api/questions/${questionId}/answers`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: $userUuid,
      },
    });

    const data = await response.json();
    // await tick();
    question = {
      ...question,
      total_answers: data.length,
    };
    answersList = data;
  };

  const getAllDetails = () => {
    const data = localStorage.getItem('@questionData');
    if (data) {
      const jsonData = JSON.parse(data);
      question = jsonData;
      getAnswersList(jsonData.question_id);
    } else {
      alert('There was an issue in loading question');
      window.location.href = '/';
    }
  };

  onMount(() => {
    getAllDetails();

    source = new EventSource(`/sse/?user=${$userUuid}`);

    source.addEventListener('question_submission', async (e) => {
      const obj = JSON.parse(event.data);
      console.log({ obj });
      if (obj.questionId === question.question_id && obj.isUpvoted) {
        question = {
          ...question,
          total_upvotes: Number(question.total_upvotes) + 1,
        };
        return;
      }
    });

    source.addEventListener('answer_submission', async (e) => {
      const obj = JSON.parse(event.data);
      console.log({ obj });
      if (obj.questionId == question.question_id) {
        getAllDetails();
        return;
      }
    });

    source.onmessage = (e) => {
      console.log({ e });
    };
    source.addEventListener('init', () => {
      console.log('init triggered');
    });
  });

  onDestroy(() => {
    console.log('question view removed');
    source.close();
  });
</script>

<div>
  <h1>Question</h1>

  {#if question}
    <h4>{question.title}</h4>
    <p>{question.text}</p>
    <p>total answers: {question.total_answers}</p>
    <p>total upvotes: {question.total_upvotes}</p>
  {/if}

  Answers list
  <Button onClick={onAddAnswer}>Add my answer</Button>

  <AnswerList answers={answersList} />
</div>
