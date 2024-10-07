'use strict';
const boardElement = document.querySelector('.board');
const resultElement = document.querySelector('.result');
const scoreboardElement = document.querySelector('.score');
const modalStart = document.querySelector('.start-game');
const modalEnd = document.querySelector('.game-over');

const winSound = document.querySelector('.win-sound');
const loseSound = document.querySelector('.lose-sound');
const tieSound = document.querySelector('.tie-sound');

const x = `<i class="fa-solid fa-xmark fa-2xl"></i>`;

const o = `<i class="fa-solid fa-o fa-xl"></i>`;

let board = Array(9).fill(null);
let currentPlayer = 'X';
let playerSymbol = 'X';
let computerSymbol = 'O';
let moves = 0;
let gameActive = true;
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function showModal(modal) {
  modal.classList.add('moda-open');
  modal.classList.remove('modal-close');
}

function closeModal(modal) {
  modal.classList.remove('moda-open');
  modal.classList.add('modal-close');
}

function startGame(pick) {
  closeModal(modalStart);
  playerSymbol = pick;
  computerSymbol = playerSymbol === 'X' ? 'O' : 'X';
  if (playerSymbol === 'O') {
    computerMove();
  }
}

function makeMove(index) {
  if (gameActive && !board[index]) {
    board[index] = currentPlayer;
    boardElement.children[index].innerHTML = currentPlayer === 'X' ? x : o;
    moves++;
    if (checkWin()) {
      endGame(currentPlayer, moves);
    } else if (moves === 9) {
      endGame(null, moves);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      if (currentPlayer === computerSymbol) {
        computerMove();
      }
    }
  }
}

function computerMove() {
  let availableMoves = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
  let randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  makeMove(randomIndex);
}

function checkWin() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      // Добавляем класс .win к выигрышной линии
      boardElement.children[a].children[0].classList.add('win');
      boardElement.children[b].children[0].classList.add('win');
      boardElement.children[c].children[0].classList.add('win');
      return true;
    }
  }
  return false;
}

function endGame(winner, movesCount) {
  let message;
  if (winner === playerSymbol) {
    message = 'You won!';
    winSound.play();
  } else if (winner === computerSymbol) {
    message = 'You lose!';
    loseSound.play();
  } else {
    message = 'It\'s a tie!';
    tieSound.play();
  }
  showModal(modalEnd);
  resultElement.innerHTML = `${message}<br>Amount of moves: ${movesCount}`;
  gameActive = false;
  for (const cell of boardElement.children) {
    cell.classList.add('disabled');
  }
  saveResult({ message, moves: movesCount });
  renderScoreboard();
}

function saveResult(result) {
  let results = JSON.parse(localStorage.getItem('game-results')) || [];
  results.push(result);
  if (results.length > 10) {
    results.shift();
  }
  localStorage.setItem('game-results', JSON.stringify(results));
}
function renderScoreboard() {
  const results = JSON.parse(localStorage.getItem('game-results')) || [];
  scoreboardElement.innerHTML = results.map((result, index) => `<div>${index + 1}. ${result.message}, Steps: ${result.moves}</div>`).join('');
}
renderScoreboard();

function resetGame() {
  closeModal(modalEnd);
  board = Array(9).fill(null);
  currentPlayer = 'X';
  moves = 0;
  gameActive = true;
  resultElement.textContent = '';
  showModal(modalStart);
  for (const cell of boardElement.children) {
    cell.innerHTML = '';
    cell.classList.remove('disabled');
  }
}

function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', () => makeMove(i));
    boardElement.appendChild(cell);
  }
}
createBoard();
