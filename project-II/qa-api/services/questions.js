import { sql } from '../database/database.js';

const getAllSorted = async (user_id) => {
  return await sql`
SELECT 
    q.question_id,
    q.user_uuid,
    q.title,
    q.text,
    q.created_at,
    COALESCE(qu.upvote_count, 0) AS total_upvotes,
    COALESCE(a.answer_count, 0) AS total_answers,
    COALESCE(MAX(qup.upvoted_at), q.created_at) AS recent_activity,
    CASE WHEN qup_user.question_id IS NOT NULL THEN TRUE ELSE FALSE END AS user_upvoted
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
LEFT JOIN 
    question_upvotes qup_user
ON 
    q.question_id = qup_user.question_id
    AND qup_user.user_uuid = ${user_id}
GROUP BY 
    q.question_id, qu.upvote_count, a.answer_count, qup_user.question_id
ORDER BY 
    recent_activity DESC;
`;
};

const addQuestion = async (user_uuid, title, text) => {
  return await sql`
      INSERT INTO questions (user_uuid, title, text, created_at)
      VALUES (${user_uuid}, ${title}, ${text}, CURRENT_TIMESTAMP)
      RETURNING question_id;
    `;
};

const addUpvote = async (question_id, user_uuid) => {
  return await sql`INSERT INTO question_upvotes (question_id, user_uuid, upvoted_at) 
    VALUES (${question_id}, ${user_uuid}, CURRENT_TIMESTAMP) RETURNING question_id`;
};

export { getAllSorted, addQuestion, addUpvote };
