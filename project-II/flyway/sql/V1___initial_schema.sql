CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    user_uuid TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_user_id ON questions (user_uuid);

CREATE TABLE answers (
    answer_id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions (question_id),
    user_uuid TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_answers_question_id ON answers (question_id);

CREATE TABLE question_upvotes (
    question_id INT REFERENCES questions (question_id),
    user_uuid TEXT NOT NULL,
    upvoted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (question_id, user_uuid)
);

CREATE INDEX idx_question_upvotes_question_id_upvoted_at ON question_upvotes (question_id, upvoted_at);

CREATE TABLE answer_upvotes (
    answer_id INT REFERENCES answers (answer_id),
    user_uuid TEXT NOT NULL,
    upvoted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (answer_id, user_uuid)
);

CREATE INDEX idx_answer_upvotes_answer_id_upvoted_at ON answer_upvotes (answer_id, upvoted_at);