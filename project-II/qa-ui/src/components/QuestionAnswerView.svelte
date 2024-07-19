<script>
  import { tick, onDestroy, onMount } from 'svelte';
  import {
    getSubmissionTime,
    setSubmissionTime,
    userUuid,
  } from '../stores/stores';
  import AnswerList from './AnswerList.svelte';
  import AnswerForm from '../forms/AnswerForm.svelte';
  import Notification from './Notification.svelte';

  let source;
  let question;
  let answerText = '';
  let answersList = [];
  let addingAnswer = false;
  let itemsCount = 20;
  let showNotification = false;

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

  const goBack = () => {
    window.location.href = '/';
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
          showNotification = true;
          setTimeout(() => {
            showNotification = false;
          }, 5000);
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
  <Notification show={showNotification} text={'Answer has been submitted'} />
  <div class={'flex flex-1 flex-col  p-10 relative'}>
    {#if question}
      <div class={'flex items-center gap-5 mb-5'}>
        <button on:click={goBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <h1 class="text-4xl font-bold tracking-tight text-gray-900">
          Question
        </h1>
      </div>
      <h4 class="mb-2 text-xl font-bold tracking-tight text-gray-900">
        {question.title}
      </h4>
      <p class="mb-2 font-normal tracking-tight text-gray-600">
        {question.text}
      </p>
      <div class="flex w-full flex-row justify-end gap-10 my-5">
        <p>
          {question.total_answers}{answersList.length < itemsCount ? '' : '+'} Answers
        </p>
        <div class={`flex gap-4`}>
          {question.total_upvotes}
          Upvotes
        </div>
      </div>
    {/if}
    <AnswerForm
      text={answerText}
      {onChangeText}
      onSubmit={onAnswerSubmit}
      loading={addingAnswer}
    />
  </div>
  <AnswerList answers={answersList} />
</div>
