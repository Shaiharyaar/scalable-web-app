import { sql } from '../database/database.js';

const getAllSorted = async (user_id) => {
  return await sql`
SELECT 
    q.question_id,
    q.user_uuid,
    q.title,
    q.body,
    q.created_at,
    COALESCE(qu.upvote_count, 0) AS total_upvotes,
    COALESCE(a.answer_count, 0) AS total_answers,
    CASE WHEN qup.question_id IS NOT NULL THEN TRUE ELSE FALSE END AS user_upvoted
FROM 
    questions q
LEFT JOIN 
    (SELECT question_id, COUNT(*) AS upvote_count 
     FROM question_upvotes 
     GROUP BY question_id) qu
ON 
    q.question_id = qu.question_id
LEFT JOIN 
    (SELECT question_id, COUNT(*) AS answer_count 
     FROM answers 
     GROUP BY question_id) a
ON 
    q.question_id = a.question_id
LEFT JOIN 
    question_upvotes qup
ON 
    q.question_id = qup.question_id
    AND qup.user_uuid = ${user_id};

`;
};

export { getAllSorted };
