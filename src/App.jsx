import { atom, selector, selectorFamily, useRecoilState, useRecoilValue, useSetRecoilState  } from "recoil";

import "./App.css"

const N_GUESSES = 6;
const ANSWER = "HUBDL"

const GUESS_STATUS = Object.freeze({
    CLEAN: 'CLEAN',
    DIRTY: 'DIRTY',
    SUBMITTED: 'SUBMITTED',
})

const LETTER_STATUS = Object.freeze({
    INCORRECT: 'INCORRECT',
    PARTIALLY_CORRECT: 'PARTIALLY_CORRECT',
    CORRECT: 'CORRECT',
})

const gameState = atom({
    key: 'gameState',
    default: Array(N_GUESSES).fill(
        {
            letters: Array(ANSWER.length).fill({ letter: null, status: null, }),
            status: GUESS_STATUS.CLEAN,
        }
    ),
})

const currentGuessIndexState = selector({
    key: 'currentGuessIndexState',
    get: ({ get }) => {
        const guesses = get(gameState);
        return guesses.findIndex(g => g.status !== GUESS_STATUS.SUBMITTED);
    }
})

const letterState = selectorFamily({
    key: 'letterState',
    get: ({ guessIndex, letterIndex }) => ({ get }) => {
        const guesses = get(gameState)
        return guesses[guessIndex].letters[letterIndex]
    }
})

const Tile = ({ guessIndex, letterIndex }) => {
    const currentGuessIndex = useRecoilValue(currentGuessIndexState);
    const letter = useRecoilValue(letterState({ guessIndex, letterIndex }))
    const setGame = useSetRecoilState(gameState)

    const handleChange = ({ target: { value }}) => {
        setGame((oldGame) => {
            return oldGame.map((g, i) => {
                if (guessIndex === i) {
                    return {
                        ...g,
                        letters: g.letters.map((l, j) => {
                            if (letterIndex === j) {
                                return {
                                    ...l,
                                    letter: value.toUpperCase(),
                                }
                            }
                            return l
                        }),
                        status: GUESS_STATUS.DIRTY,
                    }
                }
                return g
            })
        })
    }

    const getBackgroundColour = () => {
        switch (letter.status) {
            case LETTER_STATUS.CORRECT:
                return '#6aaa64'
            case LETTER_STATUS.PARTIALLY_CORRECT:
                return '#c9b458'
            case LETTER_STATUS.INCORRECT:
                return '#86888a'
            default:
                return null
        }
    }

    const getColour = () => {
        switch (letter.status) {
            case LETTER_STATUS.CORRECT:
            case LETTER_STATUS.PARTIALLY_CORRECT:
            case LETTER_STATUS.INCORRECT:
                return '#ffffff'
                break;
            default:
                return '#000000'
        }
    }

    return (
        <input
            className="tile"
            disabled={guessIndex !== currentGuessIndex}
            maxLength={1}
            onChange={handleChange}
            style={{
                backgroundColor: getBackgroundColour(),
                color: getColour(),
            }}
        />
    )
}

const App = () => {
    const [game, setGame] = useRecoilState(gameState);
    const currentGuessIndex = useRecoilValue(currentGuessIndexState);

    const submitGuess = (guessIndex) => {
        setGame((oldGame) => {
            return oldGame.map((g, index) => {
                if (guessIndex === index) {
                    return {
                        ...g,
                        letters: g.letters.map((l, letterIndex) => {
                            let status;
                            const ucAnswer = ANSWER.toUpperCase();
                            const ucLetter = l.letter.toUpperCase()

                            if (ucAnswer.charAt(letterIndex) === ucLetter) {
                                status = LETTER_STATUS.CORRECT
                            } else if (ucAnswer.includes(ucLetter)) {
                                status = LETTER_STATUS.PARTIALLY_CORRECT
                            } else {
                                status = LETTER_STATUS.INCORRECT
                            }

                            return {
                                ...l,
                                status,
                            }
                        }),
                        status: GUESS_STATUS.SUBMITTED,
                    }
                }
                return g
            })
        });
    };

    return (
        <div className="App">
            <h1>HUBDL</h1>
            <hr className="divider" />

            <div className="game">
                {game.map((guess, guessIndex) => {
                    const isSubmitDisabled = (guessIndex !== currentGuessIndex) || (game[guessIndex].letters.some(l => !l.letter))
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
                            >
                                Submit
                            </button>
                        </div>
                    )})}
            </div>

            <hr className="divider" />

            <pre className="game-state">{JSON.stringify(game, null, 2)}</pre>
        </div>
    );
}

export default App;