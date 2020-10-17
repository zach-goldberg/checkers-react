class SimpleCheckersModel {

  #currentPlayer = 1;
  #board = initializeBoard();

  get currentPlayer() {
    return this.#currentPlayer;
  }

  getPieceOnSquare(row, col) {
    return this.#board[row][col];
  }

  move(rowStart, colStart, rowDest, colDest) {
    assertInRange(rowStart, colStart, rowDest, colDest);
    
    const piece1 = this.getPieceOnSquare(rowStart, colStart);
    const piece2 = this.getPieceOnSquare(rowDest, colDest);

    if (piece1 === undefined || piece1.team !== this.currentPlayer || piece2 !== undefined) {
      throw new Error('Invalid move.');
    }

    this.#board[rowDest][colDest] = this.#board[rowStart][colStart];
    this.#board[rowStart][colStart] = undefined;
    if (this.#currentPlayer === 0) {
      this.#currentPlayer = 1;
    } else {
      this.#currentPlayer = 0;
    }
  }

}

function assertInRange(...args) {
  for (let value of args) {
    if (value < 0 || value >= 8) {
      throw new Error('Invalid coordinates');
    }
  }
}

function initializeBoard() {
  let board = [];
  for (let i = 0; i < 8; i++) {
    board[i] = [];
  }

  board[0][1] = {
    team: 0,
    king: false
  };

  board[2][3] = {
    team: 0,
    king: true
  };

  board[7][0] = {
    team: 1,
    king: false
  };

  board[5][5] = {
    team: 1,
    king: true
  };

  return board;
}

export default SimpleCheckersModel;