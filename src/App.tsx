import { useState } from 'react';
import wordData from './data/words.json';

interface Word {
	word: string;
	definition: string;
}

enum GameState {
	Playing,
	Finished,
}

const words: Word[] = wordData.obscure;

function App() {
	const [currentWordIndex, setCurrentWordIndex] = useState<number>(getRandomWord());
	const [answers, setAnswers] = useState<number[]>(getAnswers(currentWordIndex));
	const [gameState, setGameState] = useState<GameState>(GameState.Playing);
	const [score, setScore] = useState<number>(0);
	const [totalAnswered, setTotalAnswered] = useState<number>(0);
	const [selectedAnswer, setSelectedAnswer] = useState<number>(0);

	const handleNextWord = () => {
		const newWordIndex = getRandomWord();
		setCurrentWordIndex(newWordIndex);
		setAnswers(getAnswers(newWordIndex));
		setGameState(GameState.Playing);
	};

	const handleAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
		const selectedAnswerIndex = parseInt(event.currentTarget.value);
		setSelectedAnswer(selectedAnswerIndex);
		if (selectedAnswerIndex === currentWordIndex) {
			setScore(score + 1);
		}
		setTotalAnswered(totalAnswered + 1);
		setGameState(GameState.Finished);
	};

	const scorePercent = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;

	return <div>
		<div className="vocab_score">Score: { score } / { totalAnswered } – { scorePercent }%</div>
		<div className="vocab_word-container">
			<div className="vocab_word">{ words[ currentWordIndex ].word }</div>
		</div>
		<ul className="vocab_answer-list">
			{ answers.map( ( answerIndex, index ) => (
				<li key={ index }>
					<AnswerButton
						answerIndex={ answerIndex }
						correctIndex={ currentWordIndex }
						gameState={ gameState }
						handleAnswer={ handleAnswer }
						selectedAnswer={ selectedAnswer }
					/>
				</li>
			) ) }
		</ul>
		{ gameState === GameState.Finished && <div className="vocab_next-container">
			<div><button className="btn btn-primary" onClick={ handleNextWord }>Next</button></div>
		</div> }
	</div>;
}

function AnswerButton( props ) {
	const { answerIndex, correctIndex, gameState, handleAnswer, selectedAnswer } = props;

	let className = 'vocab_answer-btn btn btn-light';
	if ( gameState === GameState.Finished ) {
		className = 'vocab_answer-btn btn btn-secondary';
		if ( selectedAnswer === correctIndex ) {
			if ( answerIndex === selectedAnswer ) {
				className += ' btn-success';
			}
		} else {
			if ( answerIndex === selectedAnswer ) {
				className += ' btn-danger';
			} else if ( answerIndex === correctIndex ) {
				className += ' btn-warning';
			}
		}
	}

	return <button className={ className } disabled={ gameState === GameState.Finished } value={ answerIndex } onClick={ handleAnswer }>
		{ words[ answerIndex ].definition }
	</button>;
}

function getAnswers( correctIndex: number ): number[] {
	const answers = [ correctIndex ];
	while ( answers.length < 4 ) {
		const randomIndex = Math.floor( Math.random() * words.length );
		if ( !answers.includes( randomIndex ) ) {
			answers.push( randomIndex );
		}
	}
	return answers.sort( () => Math.random() - 0.5 );
}

function getRandomWord(): number {
	const randomIndex = Math.floor(Math.random() * words.length);
	return randomIndex;
}

export default App
