<script>
  export let onClick;
  // const goToQuestion = () => {
  //   localStorage.setItem('@questionId', 'question Id');
  //   window.location.href = '/question';
  // };

  // const submitQuestion = async () => {
  //   const data = {
  //     question: '???',
  //   };

  //   const response = await fetch('/api/questions', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authentication': $userUuid,
  //     },
  //     body: JSON.stringify(data),
  //   });

  //   const jsonData = await response.json();
  //   console.log(jsonData);
  //   alert(JSON.stringify(jsonData));
  // };
</script>

<button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4"
  on:click={onClick}
>
  <slot />
</button>
