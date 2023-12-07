document.addEventListener('DOMContentLoaded', () => {
    const boardContainer = document.getElementById('board');
    const boardSizeSelect = document.getElementById('board-size');
    const resetButton = document.getElementById('reset-button');

    let boardSize = parseInt(boardSizeSelect.value, 10);
    let currentPlayer = 'X';
    let gameBoard = createEmptyBoard(boardSize);
    let lastMove = { row: null, col: null, player: null };

    function createEmptyBoard(size) {
        return Array.from({ length: size }, () => Array(size).fill(''));
    }

    function checkWinner(row, col) {
        // Verifica linhas e colunas
        if (
            checkSequence(gameBoard[row]) ||
            checkSequence(getColumn(col))
        ) {
            return true;
        }

        // Verifica diagonais
        if (checkDiagonal() || checkAntiDiagonal()) {
            return true;
        }

        return false;
    }

    function checkDiagonal() {
        const diagonal = [];
        for (let i = 0; i < boardSize; i++) {
            diagonal.push(gameBoard[i][i]);
        }
        return checkSequence(diagonal);
    }

    function checkAntiDiagonal() {
        const antiDiagonal = [];
        for (let i = 0; i < boardSize; i++) {
            antiDiagonal.push(gameBoard[i][boardSize - 1 - i]);
        }
        return checkSequence(antiDiagonal);
    }

    function checkSequence(array) {
        let count = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i] === currentPlayer) {
                count++;
                if (count === boardSize) { // Alteração aqui para verificar se há sequência do tamanho da linha/coluna
                    return true;
                }
            } else {
                count = 0;
            }
        }
        return false;
    }

    function getColumn(col) {
        const column = [];
        for (let i = 0; i < boardSize; i++) {
            column.push(gameBoard[i][col]);
        }
        return column;
    }

    function handleCellClick(event) {
        const row = parseInt(event.target.dataset.row, 10);
        const col = parseInt(event.target.dataset.col, 10);

        if (gameBoard[row][col] === '') {
            gameBoard[row][col] = currentPlayer;
            lastMove = { row, col, player: currentPlayer };
            renderBoard();

            if (checkWinner(row, col)) {
                setTimeout(() => {
                    alert(`Temos um vencedor! Última jogada: ${lastMove.player} na posição (${lastMove.row}, ${lastMove.col})`);
                    resetGame();
                }, 100); // Adicionando um pequeno atraso para garantir que a última jogada seja renderizada antes do alerta
            } else if (checkDraw()) {
                alert("O jogo empatou!");
                resetGame();
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    }

    function checkDraw() {
        return gameBoard.flat().every(cell => cell !== '');
    }

    function renderBoard() {
        boardContainer.innerHTML = '';
        boardContainer.style.setProperty('--board-size', boardSize);
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.textContent = gameBoard[row][col];
                
                // Destacar a última jogada na tabela
                if (row === lastMove.row && col === lastMove.col) {
                    cell.classList.add('last-move');
                }

                cell.addEventListener('click', handleCellClick);
                boardContainer.appendChild(cell);
            }
        }
    }

    function resetGame() {
        boardSize = parseInt(boardSizeSelect.value, 10);
        gameBoard = createEmptyBoard(boardSize);
        currentPlayer = 'X';
        lastMove = { row: null, col: null, player: null };
        renderBoard();
    }

    resetButton.addEventListener('click', resetGame);
    boardSizeSelect.addEventListener('change', resetGame);

    renderBoard();
});
