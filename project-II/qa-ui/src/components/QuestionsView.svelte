<script>
  import { onMount } from 'svelte';
  import Button from './Button.svelte';
  import QuestionList from './QuestionList.svelte';

  const onClick = () => {
    alert('clicked');
    console.log('I am clicked');
  };

  onMount(() => {
    localStorage.removeItem('@questionData');
  });
</script>

<div>
  <QuestionList />
  <Button {onClick}>Add wy question</Button>
</div>
