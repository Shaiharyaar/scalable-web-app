-- Insert 60 random questions
DO $$
DECLARE
    i INT;
    user_uuids TEXT[] := ARRAY['uuid1', 'uuid2', 'uuid3', 'uuid4', 'uuid5'];
    question_titles TEXT[] := ARRAY[
        'What is the purpose of life?',
        'How to learn Python?',
        'What is the best programming language?',
        'How to stay motivated?',
        'What are the benefits of exercise?',
        'How to cook a perfect steak?',
        'What is the capital of France?',
        'How to improve memory?',
        'What is the best book you have read?',
        'How to start a business?',
        'What are the symptoms of flu?',
        'How to meditate?',
        'What is quantum computing?',
        'How to save money?',
        'What is the meaning of dreams?',
        'How to learn a new language?',
        'What are the best travel destinations?',
        'How to deal with stress?',
        'What is blockchain technology?',
        'How to invest in stocks?',
        'What is the history of the Internet?',
        'How to build a website?',
        'What are the benefits of meditation?',
        'How to write a resume?',
        'What is artificial intelligence?',
        'How to get a job?',
        'What are the causes of climate change?',
        'How to be happy?',
        'What is the importance of education?',
        'How to manage time effectively?',
        'What are the best programming practices?',
        'How to improve communication skills?',
        'What is the impact of social media?',
        'How to lose weight?',
        'What are the benefits of reading?',
        'How to stay healthy?',
        'What is machine learning?',
        'How to develop a mobile app?',
        'What are the causes of global warming?',
        'How to increase productivity?',
        'What is the future of technology?',
        'How to prepare for an interview?',
        'What are the effects of pollution?',
        'How to grow a business?',
        'What is cybersecurity?',
        'How to achieve goals?',
        'What are the best study techniques?',
        'How to create a budget?',
        'What is renewable energy?',
        'How to become a leader?',
        'What are the benefits of yoga?',
        'How to handle failure?',
        'What is the importance of teamwork?',
        'How to improve writing skills?',
        'What is the significance of art?',
        'How to build self-confidence?',
        'What are the best career options?',
        'How to learn coding?',
        'What are the benefits of technology?'
    ];
BEGIN
    FOR i IN 1..60 LOOP
        INSERT INTO questions (user_uuid, title, text)
        VALUES (
            user_uuids[ceil(random() * array_length(user_uuids, 1))::int],
            question_titles[(i - 1) % array_length(question_titles, 1) + 1],
            'Please provide detailed information on the topic.'
        );
    END LOOP;
END $$;

-- Insert 3 random answers for each question
DO $$
DECLARE
    i INT;
    j INT;
    user_uuids TEXT[] := ARRAY['uuid1', 'uuid2', 'uuid3', 'uuid4', 'uuid5'];
    answer_texts TEXT[] := ARRAY[
        'This is a detailed answer to the question.',
        'Here is some more information on this topic.',
        'I believe this is the best answer for your question.',
        'Based on my experience, this is the right answer.',
        'You might find this answer useful.',
        'This is a detailed answer to the question.',
        'Here is some more information on this topic.',
        'I believe this is the best answer for your question.',
        'Based on my experience, this is the right answer.',
        'You might find this answer useful.',
        'I think this should help you.',
        'Consider this information for your question.',
        'This is my perspective on the question.',
        'Hope this answer is helpful.',
        'Here is a well-thought-out answer.'
    ];
BEGIN
    FOR i IN 1..60 LOOP
        FOR j IN 1..50 LOOP
            INSERT INTO answers (question_id, user_uuid, text)
            VALUES (
                i,
                user_uuids[ceil(random() * array_length(user_uuids, 1))::int],
                answer_texts[ceil(random() * array_length(answer_texts, 1))::int]
            );
        END LOOP;
    END LOOP;
END $$;