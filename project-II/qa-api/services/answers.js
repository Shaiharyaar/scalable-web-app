import { sql } from '../database/database.js';

const getAllSorted = async (user_uuid, question_id) => {
  return await sql`
   SELECT 
    a.answer_id,
    a.question_id,
    a.user_uuid,
    a.body,
    a.created_at,
    COALESCE(MAX(au.upvoted_at), a.created_at) AS recent_activity,
    COUNT(au.upvoted_at) AS total_upvotes,
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
        a.answer_id, a.question_id, a.user_uuid, a.body, a.created_at, uau.answer_id
    ORDER BY 
        recent_activity DESC;
`;
};

export { getAllSorted };
