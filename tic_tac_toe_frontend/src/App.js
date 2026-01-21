import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

/**
 * Derive the winner from a board.
 * @param {(null|'X'|'O')[]} squares
 * @returns {{winner: null|'X'|'O', line: number[] | null}}
 */
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diags
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * @param {(null|'X'|'O')[]} squares
 * @returns {boolean}
 */
function isDraw(squares) {
  return squares.every((v) => v !== null) && !calculateWinner(squares).winner;
}

/**
 * @param {Object} props
 * @param {null|'X'|'O'} props.value
 * @param {() => void} props.onClick
 * @param {boolean} props.disabled
 * @param {boolean} props.isWinning
 * @param {number} props.index
 */
// PUBLIC_INTERFACE
function Square({ value, onClick, disabled, isWinning, index }) {
  return (
    <button
      type="button"
      className={`ttt-square ${isWinning ? "ttt-square--win" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={
        value ? `Square ${index + 1}: ${value}` : `Square ${index + 1}: empty`
      }
    >
      {value}
    </button>
  );
}

/**
 * @param {Object} props
 * @param {(null|'X'|'O')[]} props.squares
 * @param {(i:number) => void} props.onPlay
 * @param {boolean} props.locked
 * @param {number[] | null} props.winningLine
 */
// PUBLIC_INTERFACE
function Board({ squares, onPlay, locked, winningLine }) {
  const winningSet = useMemo(() => {
    return new Set(winningLine ?? []);
  }, [winningLine]);

  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((value, i) => (
        <Square
          key={i}
          index={i}
          value={value}
          onClick={() => onPlay(i)}
          disabled={locked || value !== null}
          isWinning={winningSet.has(i)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const draw = useMemo(() => isDraw(squares), [squares]);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const currentPlayer = xIsNext ? "X" : "O";
  const locked = Boolean(winner) || draw;

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  const handlePlay = (i) => {
    if (locked || squares[i] !== null) return;

    setSquares((prev) => {
      const next = [...prev];
      next[i] = currentPlayer;
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const statusText = winner
    ? `Winner: ${winner}`
    : draw
      ? "Draw"
      : `Turn: ${currentPlayer}`;

  return (
    <div className="App">
      <header className="App-header ttt-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <div className="ttt-container">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className="ttt-subtitle">Two players • Same device</p>

          <div className="ttt-status" role="status" aria-live="polite">
            {statusText}
          </div>

          <Board
            squares={squares}
            onPlay={handlePlay}
            locked={locked}
            winningLine={line}
          />

          <div className="ttt-actions">
            <button type="button" className="ttt-btn" onClick={handleReset}>
              Reset game
            </button>
          </div>

          <div className="ttt-help" aria-label="Game help">
            <div className="ttt-help__row">
              <span className="ttt-pill">X</span>
              <span>goes first</span>
            </div>
            <div className="ttt-help__row">
              <span className="ttt-pill">Tip</span>
              <span>Click an empty square to place your mark</span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
