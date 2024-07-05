<script>
  import { updatedQuestions, userUuid } from '../stores/stores';
  import { onMount, onDestroy } from 'svelte';
  import Button from './Button.svelte';
  import QuestionList from './QuestionList.svelte';

  let source;
  // let itemsCount = 2

  const onClick = async () => {
    const data = {
      title: 'Question title',
      text: 'This is my question',
    };

    const response = await fetch('/api/questions', {
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

  onMount(() => {
    // remove selected question information
    localStorage.removeItem('@questionData');

    source = new EventSource(`/sse/?user=${$userUuid}`);

    source.addEventListener('question_submission', async (e) => {
      const obj = JSON.parse(event.data);
      if (obj.shouldUpdateQuestions || obj.updateRequired) {
        await updatedQuestions();
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
  <Button {onClick}>Add my question</Button>
  <QuestionList />
</div>
