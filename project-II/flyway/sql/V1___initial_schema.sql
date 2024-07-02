CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    user_uuid TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_user_id ON questions (user_uuid);

CREATE TABLE answers (
    answer_id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions (question_id),
    user_uuid TEXT NOT NULL,
    body TEXT NOT NULL,
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

INSERT INTO
    questions (user_uuid, title, body)
VALUES (
        'uuid1',
        'What is PostgreSQL?',
        'Can someone explain what PostgreSQL is?'
    ),
    (
        'uuid2',
        'How to use Flyway?',
        'I need help understanding how to use Flyway for database migrations.'
    );

INSERT INTO
    answers (question_id, user_uuid, body)
VALUES (
        1,
        'uuid2',
        'PostgreSQL is an open-source relational database management system.'
    ),
    (
        2,
        'uuid1',
        'Flyway is a database migration tool that helps manage changes to your database schema.'
    );

INSERT INTO
    question_upvotes (question_id, user_uuid)
VALUES (1, 'uuid2'),
    (2, 'uuid1');

INSERT INTO
    answer_upvotes (answer_id, user_uuid)
VALUES (1, 'uuid1'),
    (2, 'uuid2');