<script>
  import {
    getSubmissionTime,
    questions,
    setQuestions,
    setSubmissionTime,
    updatedQuestions,
    userUuid,
  } from '../stores/stores';
  import { tick, onMount, onDestroy } from 'svelte';
  import QuestionList from './QuestionList.svelte';
  import QuestionForm from '../forms/QuestionForm.svelte';
  import Notification from './Notification.svelte';

  let source;
  let addQuestion = false;
  let addingQuestion;
  let itemsCount = 20;
  let showNotification = false;

  const onQuestionSubmit = async (e) => {
    e.preventDefault();
    const waitingTime = getSubmissionTime();
    if (waitingTime > 0) {
      alert(
        `You can submit your question after ${parseInt(waitingTime)} seconds`
      );
      return;
    }
    addingQuestion = true;

    const data = {
      title: e.target.title.value,
      text: e.target.text.value,
    };
    setSubmissionTime();
    const response = await fetch(`/api/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: $userUuid,
      },
      body: JSON.stringify(data),
    });

    if (response.status !== 200) {
      alert('question submission rejected');
      return;
    }
  };

  const toggleQuestionForm = () => {
    addQuestion = !addQuestion;
  };

  const onscroll = async () => {
    const scrolledTo = window.scrollY + window.innerHeight;
    const threshold = 0;
    const isReachBottom = document.body.scrollHeight - threshold <= scrolledTo;
    if (isReachBottom) {
      if ($questions.length < itemsCount) return;
      itemsCount += 20;
      await tick();
      await updatedQuestions(itemsCount);
      return;
    }
  };

  onMount(() => {
    // remove selected question information
    localStorage.removeItem('@questionData');
    window.addEventListener('scroll', onscroll);
    // handleQuestionsListScroll();
    source = new EventSource(`/sse/?user=${$userUuid}`);

    source.addEventListener('question_submission', async (e) => {
      const obj = JSON.parse(event.data);
      if (obj.questionAdded) {
        await updatedQuestions(itemsCount);
        if (obj.user === $userUuid) {
          // for visual affect and good interactive experience
          setTimeout(() => {
            addQuestion = false;
            addingQuestion = false;
            showNotification = true;
            setTimeout(() => {
              showNotification = false;
            }, 5000);
          }, 1000);
        }
        return;
      }
    });

    source.addEventListener('answer_submission', async (e) => {
      const obj = JSON.parse(event.data);
      console.log({ obj });
      if (obj.answerAdded) {
        let updatedQuestions = $questions.map((question) => {
          if (question.question_id == obj.questionId) {
            return {
              ...question,
              total_answers: Number(question.total_answers) + 1,
            };
          } else {
            return question;
          }
        });
        setQuestions(updatedQuestions);
        return;
      }
    });

    source.addEventListener('answer_submission', async (e) => {
      const obj = JSON.parse(event.data);
      console.log({ obj });
      if (obj.answersAdded) {
        await updatedQuestions(itemsCount);
        return;
      }
    });

    source.onmessage = (e) => {
      window.removeEventListener('scroll', onscroll);
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
  <Notification show={showNotification} text={'Question has been added'} />
  <div
    class={`sticky top-0 flex p-5 bg-white flex-1 flex-col ${addQuestion ? 'shadow-lg rounded-lg' : ''}`}
  >
    <div class="flex w-full justify-end px-10">
      <button
        id={'show-question-form-id'}
        class="px-4 py-2 flex flex-row justify-center font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
        on:click={toggleQuestionForm}
      >
        {#if addQuestion}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="size-1 mr-2"
            height={16}
            width={16}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>

          Close
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="size-1 mr-2"
            height={16}
            width={16}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>

          Add Question
        {/if}
      </button>
    </div>
    {#if addQuestion}
      <QuestionForm loading={addingQuestion} onSubmit={onQuestionSubmit} />
    {/if}
  </div>

  <QuestionList />
</div>
