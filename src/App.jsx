import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import Tile from './Tile';
import { currentGuessIndexState, gameState } from './state';
import {
  ANSWER, GUESS_STATUS, LETTER_STATUS,
} from './constants';

import './App.css';

function App() {
  const [game, setGame] = useRecoilState(gameState);
  const currentGuessIndex = useRecoilValue(currentGuessIndexState);

  useEffect(() => {
    document.getElementById('tile-0-0').focus();
  }, []);

  const submitGuess = (guessIndex) => {
    setGame((oldGame) => oldGame.map((g, index) => {
      if (guessIndex === index) {
        return {
          ...g,
          letters: g.letters.map((l, letterIndex) => {
            let status;
            const ucAnswer = ANSWER.toUpperCase();
            const ucLetter = l.letter.toUpperCase();

            if (ucAnswer.charAt(letterIndex) === ucLetter) {
              status = LETTER_STATUS.CORRECT;
            } else if (ucAnswer.includes(ucLetter)) {
              status = LETTER_STATUS.PARTIALLY_CORRECT;
            } else {
              status = LETTER_STATUS.INCORRECT;
            }

            return {
              ...l,
              status,
            };
          }),
          status: GUESS_STATUS.SUBMITTED,
        };
      }
      return g;
    }));
  };

  return (
    <div className="App">
      <h1>HUBDL</h1>
      <hr className="divider" />

      <div className="game">
        {game.map((guess, guessIndex) => {
          const isSubmitDisabled = (guessIndex !== currentGuessIndex)
            || (game[guessIndex].letters.some((l) => !l.letter));
            /* eslint-disable react/no-array-index-key */
          return (
            <div className="guess" key={guessIndex}>
              {guess.letters.map((letter, letterIndex) => (
                <Tile
                  key={`${guessIndex}-${letterIndex}`}
                  guessIndex={guessIndex}
                  letterIndex={letterIndex}
                />
              ))}
              <button
                onClick={() => submitGuess(guessIndex)}
                disabled={isSubmitDisabled}
                type="button"
              >
                Submit
              </button>
            </div>
          );
          /* eslint-enable-line react/no-array-index-key */
        })}
      </div>

      <hr className="divider" />

      <pre className="game-state">{JSON.stringify(game, null, 2)}</pre>
    </div>
  );
}

export default App;
