import { postgres } from '../deps.js';

const sql = postgres({});

const getItem = async (id) => {
  const items = await sql`SELECT * FROM todos WHERE id = ${id}`;
  return items[0];
};

const getItems = async () => {
  return await sql`SELECT * FROM todos`;
};

const addItem = async (item) => {
  await sql`INSERT INTO todos (item) VALUES (${item})`;
};

const deleteItem = async (id) => {
  return await sql`DELETE FROM todos WHERE id = ${id} RETURNING *`;
};

export { getItem, getItems, addItem, deleteItem };
