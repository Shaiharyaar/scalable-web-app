import { sql } from '../database/database.js';

const findAll = async () => {
  return await sql`SELECT * FROM programming_assignments;`;
};

const findByNumber = async (number) => {
  const [assignment] =
    await sql`SELECT * FROM programming_assignments WHERE assignment_order = ${number};`;
  return assignment;
};

const addAssignment = async (title, assignment_order, handout, test_code) => {
  return await sql`
    INSERT INTO programming_assignments (title, assignment_order, handout, test_code) VALUES 
    (${title}, ${assignment_order}, ${handout}, ${test_code})
  ;`;
};

const postSubmission = async (assignmentId, code, user) => {
  const [addedSubmission] = await sql`
    INSERT INTO programming_assignment_submissions
      (programming_assignment_id, code, user_uuid) 
      VALUES 
      (${assignmentId}, ${code}, ${user}) 
    RETURNING *;
  `;
  return addedSubmission;
};

const findSimilar = async (assignmentId, code) => {
  const [row] = await sql`
    SELECT * FROM 
    (SELECT * FROM programming_assignment_submissions WHERE programming_assignment_id=${assignmentId} AND code=${code})
      AS subquery WHERE status='processed';`;
  return row;
};

const getSubmissionsByUser = async (user_uuid) => {
  const rows = await sql`
    SELECT * FROM programming_assignment_submissions WHERE user_uuid=${user_uuid};`;
  return rows;
};

const checkForPendingSubmissions = async (user_uuid) => {
  const [{ count }] = await sql`
    SELECT COUNT(*) FROM programming_assignment_submissions WHERE user_uuid=${user_uuid} AND status='pending';`;
  return count != 0;
};

export {
  findAll,
  findByNumber,
  addAssignment,
  postSubmission,
  getSubmissionsByUser,
  checkForPendingSubmissions,
  findSimilar,
};
