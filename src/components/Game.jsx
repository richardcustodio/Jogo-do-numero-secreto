// src/components/Game.jsx
import React, { useState, useEffect } from "react";
import "../styles/game.css";

const Game = () => {
  const [secretNumber, setSecretNumber] = useState(0);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [bestScore, setBestScore] = useState(
    parseInt(localStorage.getItem("bestScore")) || Infinity
  );

  useEffect(() => {
    generateSecretNumber();
  }, [difficulty]);

  const generateSecretNumber = () => {
    let maxNumber = 100;
    if (difficulty === "medium") maxNumber = 500;
    if (difficulty === "hard") maxNumber = 1000;

    const newSecretNumber = Math.floor(Math.random() * maxNumber) + 1;
    setSecretNumber(newSecretNumber);
    setGuess("");
    setMessage(`Tente adivinhar o número secreto entre 1 e ${maxNumber}.`);
    setAttempts(0);
    setGameOver(false);
  };

  const handleInputChange = (event) => {
    setGuess(event.target.value);
  };

  const handleGuessSubmit = () => {
    if (gameOver) return;

    const parsedGuess = parseInt(guess, 10);

    let maxNumber = 100;
    if (difficulty === "medium") maxNumber = 500;
    if (difficulty === "hard") maxNumber = 1000;

    if (isNaN(parsedGuess) || parsedGuess < 1 || parsedGuess > maxNumber) {
      setMessage(`Por favor, digite um número válido entre 1 e ${maxNumber}.`);
      return;
    }

    setAttempts((prevAttempts) => prevAttempts + 1);

    if (parsedGuess === secretNumber) {
      setMessage(
        `Parabéns! Você acertou o número secreto (${secretNumber}) em ${
          attempts + 1
        } tentativas.`
      );
      setGameOver(true);

      if (attempts + 1 < bestScore) {
        setBestScore(attempts + 1);
        localStorage.setItem("bestScore", attempts + 1);
      }
    } else if (parsedGuess < secretNumber) {
      setMessage("Muito baixo! Tente um número maior.");
    } else {
      setMessage("Muito alto! Tente um número menor.");
    }
    setGuess("");
  };

  const handleResetGame = () => {
    generateSecretNumber();
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  return (
    <div className="game-container">
      <h1>Jogo do Número Secreto</h1>
      <div className="difficulty-selector">
        <label htmlFor="difficulty">Dificuldade:</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={handleDifficultyChange}
        >
          <option value="easy">Fácil (1-100)</option>
          <option value="medium">Médio (1-500)</option>
          <option value="hard">Difícil (1-1000)</option>
        </select>
      </div>
      <p className="message">{message}</p>
      <input
        type="number"
        placeholder="Seu palpite"
        value={guess}
        onChange={handleInputChange}
        className="guess-input"
      />
      <button
        onClick={handleGuessSubmit}
        disabled={gameOver}
        className="guess-button"
      >
        Enviar Palpite
      </button>
      <p className="attempts">Tentativas: {attempts}</p>
      {gameOver && (
        <button onClick={handleResetGame} className="reset-button">
          Jogar Novamente
        </button>
      )}
      {bestScore !== Infinity && (
        <p className="best-score">Melhor resultado: {bestScore} tentativas</p>
      )}
    </div>
  );
};

export default Game;
