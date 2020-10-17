import React from 'react';

import SimpleCheckersModel from '../core/SimpleCheckersModel';

const SIZE = 800;
const CELL_SIZE = SIZE / 8;

class CheckersBoard extends React.Component {
    canvasRef = React.createRef();
    model = new SimpleCheckersModel();
    state = {
      board: this.getBoard2DArray(),
      selectedCell: {
        row: -1,
        col: -1
      }
    };

    componentDidMount() {
      this.drawBoard();
    }

    componentDidUpdate() {
      this.drawBoard();
    }

    handleClick(event) {
      const row = Math.floor(event.clientY / CELL_SIZE) - 1;
      const col = Math.floor(event.clientX / CELL_SIZE);
      const { row: selectedRow, col: selectedCol } = this.state.selectedCell
      const piece = this.model.getPieceOnSquare(row, col);

      if (selectedRow === -1 && piece !== undefined && piece.team === this.model.currentPlayer) {
        this.setState({
          selectedCell: {
            row,
            col
          }
        });
      } else if (selectedRow !== -1) {
        try {
          this.model.move(selectedRow, selectedCol, row, col);
        } catch(e) {
          // invalid move
        }
        this.setState({
          board: this.getBoard2DArray(),
          selectedCell: {
            row: -1,
            col: -1
          }
        });
      }
    }

    render() {
      return (
        <canvas ref={this.canvasRef} width={SIZE} height={SIZE} onClick={this.handleClick.bind(this)} />
      )
    }

    drawBoard() {
      const ctx = this.canvasRef.current.getContext('2d');
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          this.drawCell(ctx, row, col);
        }
      }

      const { row: selectedRow, col: selectedCol } = this.state.selectedCell
      if (selectedRow !== -1 && selectedCol !== -1) {
        this.drawCell(ctx, selectedRow, selectedCol);
      }
    }

    drawCell(ctx, row, col) {
      ctx.beginPath();
      if (row === this.state.selectedCell.row && col === this.state.selectedCell.col) {
        ctx.shadowColor = 'yellow';
        ctx.shadowBlur = 15;
      }
      ctx.fillStyle = getColor(row, col);
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      ctx.shadowBlur = 0;
      this.drawPiece(ctx, row, col);
    }

    drawPiece(ctx, row, col) {
      const piece = this.model.getPieceOnSquare(row, col);
      if (piece === undefined) {
        return;
      }
    
      ctx.beginPath();
      ctx.fillStyle = piece.team === 0 ? 'blue' : 'yellow';
      ctx.arc(col * CELL_SIZE + CELL_SIZE / 2, row * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE * 0.4, 0, 2 * Math.PI);
      ctx.fill();
    
      if (piece.king) {
        ctx.beginPath();
        ctx.fillStyle = 'gray';
        ctx.arc(col * CELL_SIZE + CELL_SIZE / 2, row * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE * 0.1, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    getBoard2DArray() {
      const board = [];
      for (let row = 0; row < 8; row++) {
        board[row] = [];
        for (let col = 0; col < 8; col++) {
          board[row][col] = this.model.getPieceOnSquare(row, col);
        }
      }
      return board;
    }
}

function getColor(row, col) {
  if ((row % 2 === 0 && col % 2 === 0) || (row % 2 === 1 && col % 2 === 1)) {
    return 'red';
  } else {
    return 'black';
  }
}

export default CheckersBoard;