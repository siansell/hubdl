import { atom, selector, selectorFamily } from 'recoil';

import { ANSWER, N_GUESSES, GUESS_STATUS } from './constants';

export const gameState = atom({
  key: 'gameState',
  default: Array(N_GUESSES).fill(
    {
      letters: Array(ANSWER.length).fill({ letter: null, status: null }),
      status: GUESS_STATUS.CLEAN,
    },
  ),
});

export const currentGuessIndexState = selector({
  key: 'currentGuessIndexState',
  get: ({ get }) => {
    const guesses = get(gameState);
    return guesses.findIndex((g) => g.status !== GUESS_STATUS.SUBMITTED);
  },
});

export const letterState = selectorFamily({
  key: 'letterState',
  get: ({ guessIndex, letterIndex }) => ({ get }) => {
    const guesses = get(gameState);
    return guesses[guessIndex].letters[letterIndex];
  },
});
