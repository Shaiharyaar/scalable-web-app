TODO: The DATABASE.md outlines the database schema and justifies the used indexes and database denormalization decisions.

TODO for merits: Caching decisions are outlined in DATABASE.md.

### Database Structure

```
CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    user_uuid TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE INDEX idx_questions_user_id ON questions (user_uuid);

CREATE TABLE answers (
    answer_id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions (question_id),
    user_uuid TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);
CREATE INDEX idx_answers_question_id ON answers (question_id);

CREATE TABLE question_upvotes (
    question_id INT REFERENCES questions (question_id),
    user_uuid TEXT NOT NULL,
    upvoted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (question_id, user_id)
);
CREATE INDEX idx_question_upvotes_question_id_upvoted_at ON question_upvotes (question_id, upvoted_at);

CREATE TABLE answer_upvotes (
    answer_id INT REFERENCES answers (answer_id),
    user_uuid TEXT NOT NULL,
    upvoted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (answer_id, user_id)
);
CREATE INDEX idx_answer_upvotes_answer_id_upvoted_at ON answer_upvotes (answer_id, upvoted_at);
```

## Explanation of INDEXES

### question table

    - idx_questions_user_id: Speeds up queries filtering questions by user ID.

### answer table

    - idx_answers_question_id: Speeds up queries filtering answers by question ID.

### question_upvotes table

    - idx_question_upvotes_question_id_upvoted_at: Optimizes join operations and sorting by upvote times.

### answer_upvotes table:

    - idx_answer_upvotes_answer_id_upvoted_at: Optimizes join operations and sorting by upvote times.
