<script>
  import Button from './Button.svelte';
  import QuestionList from './QuestionList.svelte';

  const onClick = () => {
    alert('clicked');
    console.log('I am clicked');
  };
</script>

<div>
  <QuestionList />
  <Button {onClick}>Add wy question</Button>
</div>
