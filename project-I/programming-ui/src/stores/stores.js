import { readable, writable } from 'svelte/store';

let user = localStorage.getItem('@userId');

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem('@userId', user);
}

export const assignments = writable([], async (set) => {
  const data = await getAssignments();
  set(data);
});

const getAssignments = async () => {
  const response = await fetch('/api/getAssignments', {
    headers: {
      Authorization: user,
    },
  });

  const data = await response.json();
  return data;
};

export const updatedAssignments = async () => {
  const data = await getAssignments();
  assignments.set(data);
};

export const userUuid = readable(user);
