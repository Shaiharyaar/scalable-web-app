import { sql } from '../database/database.js';

const getAllSorted = async (question_id) => {
  return await sql`
    SELECT a.*, 
    COALESCE(MAX(au.upvoted_at), a.created_at) AS recent_activity
    FROM answers a
    LEFT JOIN answer_upvotes au ON a.answer_id = au.answer_id
    WHERE a.question_id = ${question_id}
    GROUP BY a.answer_id
    ORDER BY recent_activity DESC;
`;
};

export { getAllSorted };
