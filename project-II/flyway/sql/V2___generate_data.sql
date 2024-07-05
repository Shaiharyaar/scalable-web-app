INSERT INTO
    questions (user_uuid, title, text)
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
    answers (question_id, user_uuid, text)
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