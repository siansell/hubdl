import React, { Suspense, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import Tile from './Tile';
import { answerQuery, currentGuessIndexState, gameState } from './state';
import { GUESS_STATUS, LETTER_STATUS } from './constants';

import './App.css';

function AppWrapper() {
  return (
    <div className="App">
      <h1>HUBDL</h1>
      <hr className="divider" />
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </div>
  );
}

function App() {
  const [game, setGame] = useRecoilState(gameState);
  const currentGuessIndex = useRecoilValue(currentGuessIndexState);

  const answer = useRecoilValue(answerQuery);

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
            const ucAnswer = answer.toUpperCase();
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
    <>
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
    </>
  );
}

export default AppWrapper;
