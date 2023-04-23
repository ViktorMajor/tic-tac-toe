const idInput = document.querySelector('#input');
const playButton = document.querySelector('.play');
const title = document.querySelector('.title');
const footer = document.querySelector('.footer');
const vs = document.querySelector('.vs');
const player1 = document.querySelector('.player1');w
const player2 = document.querySelector('.player2');
const gameboard = document.querySelector('.game-board');
const namePointText = document.querySelector('#name');
const returnButton = document.querySelector('.return');
const video = document.querySelector('video');

// show the play button
idInput.addEventListener('keyup', (event) => {
  if (idInput.value.trim() !== '') {
    playButton.style.display = 'block';
    } 
});

//move the element from start
function startStatus() {
  title.style.top = '-300px';
  playButton.style.top = '-300px';
  vs.style.top = '-550px';
  footer.style.top = '+150px';
  player1.style.left = '-13%';
  player2.style.left = '+13%';
  player2.style.width = '20%';
  player1.style.width = '20%';
  gameboard.style.top = '-81vh';
}

let round = 0;
playButton.addEventListener('click', startRound);
document.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    startRound();
  }
});

function startRound() {
  if (round === 0) {
    //video.play();
    round++;
    setTimeout(() => {
      startStatus();
    }, 500);
  } else {
    startStatus();
  }
}











let initialTitleState = title.style.top;
let initialPlayButtonState = playButton.style.top;
let initialVsState = vs.style.top;
let initialFooterState = footer.style.top;
let initialPlayer1State = player1.style.left;
let initialPlayer2State = player2.style.left;
let initialScreen2State = gameboard.style.top;


function clearAll() {
  idInput.value = '';
  playButton.style.display = 'none';
  title.style.top = initialTitleState;
  playButton.style.top = initialPlayButtonState;
  vs.style.top = initialVsState;
  footer.style.top = initialFooterState;
  player1.style.left = initialPlayer1State;
  player2.style.left = initialPlayer2State;
  player2.style.width = '25%';
  player1.style.width = '25%';
  gameboard.style.top = initialScreen2State;
  emptySquares()
}

returnButton.addEventListener('click', () => {
  clearAll();
})





var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}
function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}