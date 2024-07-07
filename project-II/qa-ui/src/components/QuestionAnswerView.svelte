<script>
  import { tick, onDestroy, onMount } from 'svelte';
  import {
    getSubmissionTime,
    setSubmissionTime,
    userUuid,
  } from '../stores/stores';
  import AnswerList from './AnswerList.svelte';
  import AnswerForm from '../forms/AnswerForm.svelte';

  let source;
  let question;
  let answerText = '';
  let answersList = [];
  let addingAnswer = false;
  let itemsCount = 20;

  const onChangeText = (e) => {
    answerText = e.target.value;
  };

  const onAnswerSubmit = async () => {
    const waitingTime = getSubmissionTime();
    if (waitingTime > 0) {
      alert(
        `You can submit your answer after ${parseInt(waitingTime)} seconds`
      );
      return;
    }
    addingAnswer = true;
    const data = {
      text: answerText,
    };
    setSubmissionTime();
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
    const response = await fetch(
      `/api/questions/${questionId}/answers/${itemsCount}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: $userUuid,
        },
      }
    );

    const data = await response.json();
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

  const onscroll = async () => {
    const scrolledTo = window.scrollY + window.innerHeight;
    const threshold = 0;
    const isReachBottom = document.body.scrollHeight - threshold <= scrolledTo;
    if (isReachBottom) {
      if (answersList.length < itemsCount) return;
      itemsCount += 20;
      await tick();
      await getAnswersList(question.question_id);
      return;
    }
  };

  onMount(() => {
    getAllDetails();
    window.addEventListener('scroll', onscroll);

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
      if (obj.user === $userUuid && obj.answerAdded) {
        setTimeout(() => {
          addingAnswer = false;
          answerText = '';
        }, 1000);
      }
      if (obj.questionId == question.question_id) {
        getAllDetails();
        return;
      }
    });

    source.addEventListener('init', () => {
      console.log('init triggered');
    });
  });

  onDestroy(() => {
    console.log('question view removed');
    window.removeEventListener('scroll', onscroll);

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
  <AnswerForm
    text={answerText}
    {onChangeText}
    onSubmit={onAnswerSubmit}
    loading={addingAnswer}
  />
  Answers list

  <AnswerList answers={answersList} />
</div>
