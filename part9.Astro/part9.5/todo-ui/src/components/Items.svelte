<script>
  let item = '';
  const getItems = async () => {
    const response = await fetch('/api/todos');
    return await response.json();
  };

  const addTodo = async () => {
    if (item.trim().length == 0) {
      alert('You cannot add empty "todo"');
      return;
    }

    const newItem = { item };

    await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(newItem),
    });

    item = '';

    itemsPromise = getItems();
  };

  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });

    itemsPromise = getItems();
  };

  let itemsPromise = getItems();
</script>

<h1>Todos</h1>

<input type="text" bind:value={item} />
<button on:click={addTodo}>Add item</button>

{#await itemsPromise}
  <p>Loading todos</p>
{:then todos}
  {#if todos.length == 0}
    <p>No todos available</p>
  {:else}
    <ul>
      {#each todos as todo}
        <li>
          <span>
            {todo.item}
          </span>
          <button
            style={'background:none;border:none;border-radius:3px;margin-left:10px;cursor:pointer;color:red'}
            on:click={() => deleteTodo(todo.id)}>Remove</button
          >
        </li>
      {/each}
    </ul>
  {/if}
{/await}
