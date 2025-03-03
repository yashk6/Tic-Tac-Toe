import { useState } from "react";

import Player from "./assets/component/Player.jsx";
import GameBoard from "./assets/component/GameBoard.jsx";
import Log from "./assets/component/Log.jsx";
import GameOver from "./assets/component/GameOver.jsx";
import { WINNING_COMBINATIONS } from "./assets/component/Winning-Combinations.js";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  if (gameTurns.length === 0) return "X";
  return gameTurns[gameTurns.length - 1].player === "X" ? "O" : "X";
}

function deriveGameBoard(gameTurns) {
  let gameBoard = INITIAL_GAME_BOARD.map((row) => [...row]);

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
}

function deriveWinner(gameBoard, players) {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    const firstSquareSymbol = gameBoard[a.row][a.col];
    const secondSquareSymbol = gameBoard[b.row][b.col];
    const thirdSquareSymbol = gameBoard[c.row][c.col];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      return players[firstSquareSymbol];
    }
  }
  return null;
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const [gameOver, setGameOver] = useState(false); // State to track if the game is over

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  // Determine if the game is over (either draw or win)
  const isGameOver = winner || hasDraw;

  function handleSelectSquare(rowIndex, colIndex) {
    if (gameBoard[rowIndex][colIndex] || isGameOver) return; // Prevent selecting an occupied square or after the game is over

    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [
        ...prevTurns,
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
      ];

      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
    setGameOver(false); // Reset the game over state when restarting the game
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => ({
      ...prevPlayers,
      [symbol]: newName,
    }));

    // Optional: Reset the game when the name is changed
    setGameTurns([]);
    setGameOver(false); // Reset game over state when name changes
  }

  return (
    <main>
      <div id="game-container">
        <ol id="Players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {/* Show the GameOver component only when the game is over */}
        {isGameOver && <GameOver winner={winner} onRestart={handleRestart} />}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
