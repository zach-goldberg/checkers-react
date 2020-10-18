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

    let jumpMovesMap;
    let jumpedPiecePosns;

    if (piece1 === undefined
      || piece1.team !== this.currentPlayer
      || piece2 !== undefined
      || !canMoveSimple(piece1, rowStart, colStart, rowDest, colDest)) {
      jumpMovesMap = getPossibleJumpMoves(this.#board, piece1, rowStart, colStart);
      jumpedPiecePosns = jumpMovesMap[`${rowDest} ${colDest}`];
      if (!jumpedPiecePosns) {
        throw new Error('Invalid move.');
      }
    }

    this.#board[rowDest][colDest] = this.#board[rowStart][colStart];
    this.#board[rowStart][colStart] = undefined;
    if (jumpedPiecePosns) {
      jumpedPiecePosns.forEach(posn => {
        this.#board[posn.row][posn.col] = undefined;
      });
    }

    if (piece1.team === 1 && rowDest === 0) {
      piece1.king = true;
    } else if (piece1.team === 0 && rowDest === 7) {
      piece1.king = true;
    }

    if (this.#currentPlayer === 0) {
      this.#currentPlayer = 1;
    } else {
      this.#currentPlayer = 0;
    }
  }
}

function canMoveSimple(piece, rowStart, colStart, rowDest, colDest) {
  if (piece.king) {
    return (Math.abs(rowStart - rowDest) === 1 && Math.abs(colStart - colDest) === 1);
  } else if (piece.team === 1) {
    return (rowStart - rowDest === 1 && Math.abs(colStart - colDest) === 1);
  } else {
    return (rowDest - rowStart === 1 && Math.abs(colStart - colDest) === 1);
  }
}

function getPossibleJumpMoves(board, piece, rowStart, colStart) {
  const moves = new Map();
  moves[`${rowStart} ${colStart}`] = [];
  fillPossibleJumpMovesRecur(board, piece, rowStart, colStart, moves);
  moves[`${rowStart} ${colStart}`] = undefined;
  console.log(moves);
  return moves;
}


// TODO abstract this to remove code duplication
function fillPossibleJumpMovesRecur(board, piece, row, col, sofar) {
  if (piece.team === 0 || piece.king) {
    if (row + 2 < 8 && col + 2 < 8
      && board[row + 2][col + 2] === undefined
      && board[row + 1][col + 1] !== undefined
      && board[row + 1][col + 1].team !== piece.team) {
      sofar[`${row + 2} ${col + 2}`] = [...sofar[`${row} ${col}`], { row: row + 1, col: col + 1 }];
      const newBoard = board.map((boardRow, rowIndex) => boardRow.map((boardPiece, colIndex) => {
        if (row === rowIndex && col === colIndex) {
          return undefined;
        } else if (row + 1 === rowIndex && col + 1 === colIndex) {
          return undefined;
        } else if (row + 2 === rowIndex && col + 2 === colIndex) {
          return piece;
        } else {
          return boardPiece;
        }
      }));
      fillPossibleJumpMovesRecur(newBoard, piece, row + 2, col + 2, sofar);
    }
    if (row + 2 < 8 && col - 2 >= 0
      && board[row + 2][col - 2] === undefined
      && board[row + 1][col - 1] !== undefined
      && board[row + 1][col - 1].team !== piece.team) {
      sofar[`${row + 2} ${col - 2}`] = [...sofar[`${row} ${col}`], { row: row + 1, col: col - 1 }];
      const newBoard = board.map((boardRow, rowIndex) => boardRow.map((boardPiece, colIndex) => {
        if (row === rowIndex && col === colIndex) {
          return undefined;
        } else if (row + 1 === rowIndex && col - 1 === colIndex) {
          return undefined;
        } else if (row + 2 === rowIndex && col - 2 === colIndex) {
          return piece;
        } else {
          return boardPiece;
        }
      }));
      fillPossibleJumpMovesRecur(newBoard, piece, row + 2, col - 2, sofar);
    }
  }
  if (piece.team === 1 || piece.king) {
    if (row - 2 >= 0 && col + 2 < 8
      && board[row - 2][col + 2] === undefined
      && board[row - 1][col + 1] !== undefined
      && board[row - 1][col + 1].team !== piece.team) {
      sofar[`${row - 2} ${col + 2}`] = [...sofar[`${row} ${col}`], { row: row - 1, col: col + 1 }];
      const newBoard = board.map((boardRow, rowIndex) => boardRow.map((boardPiece, colIndex) => {
        if (row === rowIndex && col === colIndex) {
          return undefined;
        } else if (row - 1 === rowIndex && col + 1 === colIndex) {
          return undefined;
        } else if (row - 2 === rowIndex && col + 2 === colIndex) {
          return piece;
        } else {
          return boardPiece;
        }
      }));
      fillPossibleJumpMovesRecur(newBoard, piece, row - 2, col + 2, sofar);
    }
    if (row - 2 >= 0 && col - 2 >= 0
      && board[row - 2][col - 2] === undefined
      && board[row - 1][col - 1] !== undefined
      && board[row - 1][col - 1].team !== piece.team) {
      sofar[`${row - 2} ${col - 2}`] = [...sofar[`${row} ${col}`], { row: row - 1, col: col - 1 }];
      const newBoard = board.map((boardRow, rowIndex) => boardRow.map((boardPiece, colIndex) => {
        if (row === rowIndex && col === colIndex) {
          return undefined;
        } else if (row - 1 === rowIndex && col - 1 === colIndex) {
          return undefined;
        } else if (row - 2 === rowIndex && col - 2 === colIndex) {
          return piece;
        } else {
          return boardPiece;
        }
      }));
      fillPossibleJumpMovesRecur(newBoard, piece, row - 2, col - 2, sofar);
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
  for (let row = 0; row < 8; row++) {
    board[row] = [];
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if (row % 2 === 0 && col % 2 === 0) {
        board[row][col] = {
          team: 0,
          king: false
        }
      } else if (row % 2 === 1 && col % 2 === 1) {
        board[row][col] = {
          team: 0,
          king: false
        }
      }
    }
  }

  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (row % 2 === 0 && col % 2 === 0) {
        board[row][col] = {
          team: 1,
          king: false
        }
      } else if (row % 2 === 1 && col % 2 === 1) {
        board[row][col] = {
          team: 1,
          king: false
        }
      }
    }
  }

  return board;
}

export default SimpleCheckersModel;