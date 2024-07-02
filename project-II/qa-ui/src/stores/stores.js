import { readable, writable } from 'svelte/store';

let user = localStorage.getItem('userUuid');

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem('userUuid', user);
}

export const questions = writable([], async (set) => {
  const data = await getQuestions();
  set(data);
});

const getQuestions = async () => {
  const response = await fetch('/api/questions/', {
    headers: {
      Authorization: user,
    },
  });

  const data = await response.json();
  return data;
};

export const updatedQuestions = async () => {
  const data = await getQuestions();
  assignments.set(data);
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

export const userUuid = readable(user);
