import { readable, writable } from 'svelte/store';

let user = localStorage.getItem('userUuid');

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem('userUuid', user);
}

export const questions = writable([], async (set) => {
  const data = await getQuestions(20);
  set(data);
});

const getQuestions = async (count) => {
  const response = await fetch(`/api/questions/${count}`, {
    headers: {
      Authorization: user,
    },
  });

  const data = await response.json();
  return data;
};

export const updatedQuestions = async (count) => {
  const data = await getQuestions(count);
  console.log({ data });
  questions.set(data);
};

export const setQuestions = async (list) => {
  questions.set(list);
};

export const answers = writable([]);

const getAnswers = async (questionId) => {
  const response = await fetch(`/api/questions/${questionId}/answers`, {
    headers: {
      Authorization: user,
    },
  });

  const data = await response.json();
  return data;
};

export const updatedAnswers = async (questionId) => {
  const data = await getAnswers(questionId);
  assignments.set(data);
};

export const setSubmissionTime = () => {
  let dateTime = new Date();
  dateTime = dateTime.toISOString();

  localStorage.setItem('submissionTime', dateTime);
};

export const getSubmissionTime = () => {
  let submissionTime = localStorage.getItem('submissionTime');
  if (!submissionTime) return 0;

  let currentTime = new Date();
  submissionTime = new Date(submissionTime);

  let timeDifferenceInSeconds = (currentTime - submissionTime) / 1000;

  if (timeDifferenceInSeconds > 60) {
    localStorage.removeItem('submissionTime');
    return 0;
  } else {
    return 60 - timeDifferenceInSeconds;
  }
};

export const userUuid = readable(user);
