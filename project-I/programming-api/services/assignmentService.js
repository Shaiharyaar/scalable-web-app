import { sql } from '../database/database.js';

const getAll = async () => {
  return await sql`SELECT * FROM programming_assignments;`;
};

const findAssignment = async (number) => {
  const [assignment] =
    await sql`SELECT * FROM programming_assignments WHERE assignment_order = ${number};`;
  return assignment;
};

export { getAll, findAssignment };
