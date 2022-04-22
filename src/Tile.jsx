import React from 'react';
import PropTypes from 'prop-types';
import {
  useRecoilState, useRecoilValue,
} from 'recoil';

import {
  answerQuery, currentGuessIndexState, gameState, letterState,
} from './state';
import { GUESS_STATUS, LETTER_STATUS } from './constants';

function Tile({ guessIndex, letterIndex }) {
  const answer = useRecoilValue(answerQuery);
  const currentGuessIndex = useRecoilValue(currentGuessIndexState);
  const letter = useRecoilValue(letterState({ guessIndex, letterIndex }));
  const [game, setGame] = useRecoilState(gameState);

  const handleKeyDown = (e) => {
    // console.log(e.keyCode, game)
    switch (e.keyCode) {
      case 8: // Backspace
        setGame((oldGame) => oldGame.map((g, i) => {
          if (guessIndex === i) {
            return {
              ...g,
              letters: g.letters.map((l, j) => {
                if (letterIndex - 1 === j) {
                  return {
                    ...l,
                    letter: null,
                  };
                }
                return l;
              }),
            };
          }
          return g;
        }));
        if (letterIndex === answer.length - 1 && game[guessIndex].letters[answer.length - 1]) {
          // Final letter of guess is populated

          // TODO need to handle thi scase in setGame above
          const currentTile = document.getElementById(`tile-${guessIndex}-${letterIndex}`);
          currentTile.value = '';
        } else {
          const previousTile = document.getElementById(`tile-${guessIndex}-${letterIndex - 1}`);
          if (previousTile) {
            previousTile.value = '';
            previousTile.focus();
          }
        }
        break;
      case 9: // Tab
        console.log('tab');
        break;
      case 13: // Return
        console.log('enter');
        break;
      default:
        break;
    }
  };

  const handleChange = (e) => {
    const { target } = e;
    const { value } = target;
    if (!target.checkValidity()) {
      target.value = '';
      return;
    }

    setGame((oldGame) => oldGame.map((g, i) => {
      if (guessIndex === i) {
        return {
          ...g,
          letters: g.letters.map((l, j) => {
            if (letterIndex === j) {
              return {
                ...l,
                letter: value.toUpperCase(),
              };
            }
            return l;
          }),
          status: GUESS_STATUS.DIRTY,
        };
      }
      return g;
    }));

    const nextInput = document.getElementById(`tile-${guessIndex}-${letterIndex + 1}`);
    if (nextInput) {
      nextInput.focus();
    }
  };

  const getBackgroundColour = () => {
    switch (letter.status) {
      case LETTER_STATUS.CORRECT:
        return '#6aaa64';
      case LETTER_STATUS.PARTIALLY_CORRECT:
        return '#c9b458';
      case LETTER_STATUS.INCORRECT:
        return '#86888a';
      default:
        return null;
    }
  };

  const getColour = () => {
    switch (letter.status) {
      case LETTER_STATUS.CORRECT:
      case LETTER_STATUS.PARTIALLY_CORRECT:
      case LETTER_STATUS.INCORRECT:
        return '#ffffff';
      default:
        return '#000000';
    }
  };

  return (
    <input
      className="tile"
      disabled={guessIndex !== currentGuessIndex}
      id={`tile-${guessIndex}-${letterIndex}`}
      maxLength={1}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      pattern="[a-zA-Z]{1}"
      style={{
        backgroundColor: getBackgroundColour(),
        color: getColour(),
      }}
    />
  );
}

Tile.propTypes = {
  guessIndex: PropTypes.number.isRequired,
  letterIndex: PropTypes.number.isRequired,
};

export default Tile;
