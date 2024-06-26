import { sql } from '../database/database.js';

const findAll = async () => {
  return await sql`SELECT * FROM programming_assignments;`;
};

export const findByNumber = async (number) => {
  const [assignment] =
    await sql`SELECT * FROM programming_assignments WHERE assignment_order = ${number};`;
  return assignment;
};

const addAssignment = async (title, assignment_order, handout, test_code) => {
  return await sql`
    INSERT INTO programming_assignments (title, assignment_order, handout, test_code) VALUES (
      ${title},
      ${assignment_order},
      ${handout},
      ${test_code},
    )
  ;`;
};

export { findAll, findByNumber, addAssignment };
