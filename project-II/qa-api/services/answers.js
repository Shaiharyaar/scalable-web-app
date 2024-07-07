import { sql } from '../database/database.js';

const getAllSorted = async (user_uuid, question_id, count) => {
  return await sql`
   SELECT 
    a.answer_id,
    a.question_id,
    a.user_uuid,
    a.text,
    a.created_at,
    COALESCE(MAX(au.upvoted_at), a.created_at) AS recent_activity,
    COUNT(au.answer_id) AS total_upvotes,
    CASE WHEN uau.answer_id IS NOT NULL THEN TRUE ELSE FALSE END AS user_upvoted
    FROM 
        answers a
    LEFT JOIN 
        answer_upvotes au ON a.answer_id = au.answer_id
    LEFT JOIN 
        (SELECT answer_id 
        FROM answer_upvotes 
        WHERE user_uuid = ${user_uuid}) uau
    ON 
        a.answer_id = uau.answer_id
    WHERE 
        a.question_id = ${question_id}
    GROUP BY 
        a.answer_id, a.question_id, a.user_uuid, a.text, a.created_at, uau.answer_id
    ORDER BY 
        recent_activity DESC
    LIMIT ${count};
`;
};

const addAnswer = async (question_id, user_uuid, text) => {
  return await sql`
    INSERT INTO answers (question_id, user_uuid, text, created_at)
    VALUES (${question_id}, ${user_uuid}, ${text}, CURRENT_TIMESTAMP)
    RETURNING answer_id;
  `;
};

const addUpvote = async (answer_id, user_uuid) => {
  return await sql`
    INSERT INTO answer_upvotes (answer_id, user_uuid, upvoted_at) 
    VALUES (${answer_id}, ${user_uuid}, CURRENT_TIMESTAMP) 
    RETURNING answer_id;
  `;
};

export { getAllSorted, addAnswer, addUpvote };
