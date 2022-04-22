import axios from 'axios';
import { atom, selector, selectorFamily } from 'recoil';

import { N_GUESSES, GUESS_STATUS } from './constants';

// @TODO don't hardcode answer.length as 5 below
export const gameState = atom({
  key: 'gameState',
  default: Array(N_GUESSES).fill(
    {
      letters: Array(5).fill({ letter: null, status: null }),
      status: GUESS_STATUS.CLEAN,
    },
  ),
});

// Ref: https://recoiljs.org/docs/guides/asynchronous-data-queries
// @TODO: Don't hardcode `length` in the rquest below
// @TODO enhancement: http://random-word-api.herokuapp.com/home specify language
export const answerQuery = selector({
  key: 'answerState',
  get: async (/* { get } */) => {
    const response = await axios.get(
      'https://random-word-api.herokuapp.com/word?number=1&length=5',
    );
    return response.data[0];
  },
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
