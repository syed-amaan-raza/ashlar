import { useSyncExternalStore } from 'react';

// Tiny external store: which chapter is on screen, and its theme.
let state = { index: 0, id: 'hero', theme: 'night', menuOpen: false };
const subs = new Set();
export const getStory = () => state;
export const setStory = (patch) => {
  const next = { ...state, ...patch };
  if (Object.keys(patch).every((k) => next[k] === state[k])) return;
  state = next;
  subs.forEach((f) => f());
};
export const subscribeStory = (f) => (subs.add(f), () => subs.delete(f));
export const useStory = () => useSyncExternalStore(subscribeStory, getStory, getStory);
