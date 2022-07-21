const Board = document.body.firstElementChild;
const WinnerAnnounce = document.getElementById("winner-announce")
const X = 'X';
const O = 'O';
const E = null; // Empty box
const AIPlayer = O;
const HumanPlayer = X;



function checkWinner(state) {
    for (let i = 0; i < 3; i++) {
        let rowEqual = (
            state[i*3] &&
            state[(i*3)] === state[(i*3)+1] &&
            state[(i*3)+1] === state[(i*3)+2]
        );
        let columnEqual = (
            state[i] &&
            state[i] === state[3+i] &&
            state[3+i] === state[6+i]
        );
        if (rowEqual) {
            return state[i*3];
        }
        if (columnEqual) {
            return state[i]
        }
    }

    if (state[4]) {
        let slash = state[2] === state[4] && state[4] === state[6];
        let backslash = state[0] === state[4] && state[4] === state[8];
        if (slash || backslash) {
            return state[4];
        }
    }

    return false;
}

function evalHeuristic(winner) {
    if (winner) {
        if (winner === X) {
            return 1;
        } else if (winner === O) {
            return -1;
        }
    } else return 0;
}


function findSpots(state) {
    let availableMoves = []
    for (let boxIndex in state) {
        if (!state[boxIndex]) {
            availableMoves.push(boxIndex);
        }
    }
    return availableMoves;
}

function minimax(state, maxplayer) {
    const spots = findSpots(state);
    let winner = checkWinner(state);
    let value;

    if (!spots.length || winner) { // len == 0: terminal state
        return evalHeuristic(winner);
    }


    if (maxplayer) {
        value = -Infinity;
        for (let spot of spots) {
            state[spot] = X;
            value = Math.max(value, minimax(state, false))
            state[spot] = E;
        }
        return value;
    } else { // it's minimizing player
        value = +Infinity;
        for (let spot of spots) {
            state[spot] = O;
            value = Math.min(value, minimax(state, true))
            state[spot] = E;
        }
        return value;
    }
}

const boardState = [
    E, E, E,
    E, E, E,
    E, E, E
];

function aiTurn() {
    let bestMove;
    let bestScore = Infinity;
    for (let spot of findSpots(boardState)) {
        boardState[spot] = AIPlayer;
        let score = minimax(boardState, true);
        boardState[spot] = E;
        if (score < bestScore) {
            bestScore = score;
            bestMove = spot;
        }
    }
    boardState[bestMove] = AIPlayer;
    return bestMove;
}

function checkGameover() {
    let winner = checkWinner(boardState);
    let openSpots = findSpots(boardState);
    if (!openSpots.length || winner) {
        let txt = "Gameover, ";
        if (!winner) {
            txt += "TIE"
        } else {
            txt += (winner === HumanPlayer)? "Human" : "Computer"
        } // Note: It Is Not Possible That Human Wins
        WinnerAnnounce.innerText = txt;
        WinnerAnnounce.parentElement.style.display = "block";
        return true;
    }
    return false
}

function reset() {
    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === X) {
            Board.children[i].firstElementChild.removeAttribute("show")
        } else if (boardState[i] === O) {
            Board.children[i].lastElementChild.removeAttribute("show")
        }
        boardState[i] = E;
    }
    WinnerAnnounce.innerText = "";
    WinnerAnnounce.parentElement.style.display = "";
}


(function setEventListensers() {
    for (let boxIndex = 0; boxIndex < 9; boxIndex++) {
        Board.children[boxIndex].addEventListener("click", function(e) {
            if (boardState[boxIndex]) return;
            Board.children[boxIndex].firstElementChild.setAttribute("show", '');
            boardState[boxIndex] = HumanPlayer;
            if (checkGameover()) return;
            let aiMove = aiTurn();
            Board.children[aiMove].lastElementChild.setAttribute("show", '');
            if (checkGameover()) return;
        });
    }
})();



// console.log(aiTurn(boardState), '\nNew Board:\n', boardState);
