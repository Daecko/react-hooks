// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import { useLocalStorageState } from '../utils'

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={()=>onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  /* const [squares, setSquares] = useLocalStorageState('squares',Array(9).fill(null)); */
  const [history,setHistory] = useLocalStorageState('tik-tak-history',[Array(9).fill(null)]);
  const [currentStep,setCurrentStep] = useLocalStorageState('tik-tak-currentStep',0);
  const currentSquares = history[currentStep];
  const nextValue = calculateNextValue(currentSquares);
  const winner = calculateWinner(currentSquares);
  const status = calculateStatus(winner,currentSquares,nextValue)
  function selectSquare(square) {
    if(winner || currentSquares[square]){
      return
    }
    // 🐨 first, if there's already a winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    //
    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    //
    // 🐨 make a copy of the squares array
    // 💰 `[...squares]` will do it!)
    const copyHistory = history.slice(0,currentStep+1);
    const copySquares = [...currentSquares];
    // 🐨 set the value of the square that was selected
    // 💰 `squaresCopy[square] = nextValue`
    copySquares[square] = nextValue;
    // 🐨 set the squares to your copy
    const newHistory = [...copyHistory,copySquares];
    setHistory(newHistory);
    setCurrentStep(prev=>prev+1);
  }
  function restart() {
    // 🐨 reset the squares
    // 💰 `Array(9).fill(null)` will do it!
    setHistory(Array(9).fill(null));
    setCurrentStep(0);
  }

  const moves = history.map((steps, stepIndex)=>{
    const desc = stepIndex === 0 ? 'Go to game start' : `Go to move #${stepIndex}`;
    const isCurrent = currentStep === stepIndex;
    return (
    <li key={steps}>
      <button disabled={isCurrent} onClick={()=> setCurrentStep(stepIndex)}>
      {desc}{isCurrent&&'(current)'}
      </button>
    </li>
    )
  })
  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
