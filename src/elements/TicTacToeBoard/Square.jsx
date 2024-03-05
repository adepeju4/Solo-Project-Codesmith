import React from 'react';

function Square({ turn, player, value, row, square, onSquareClick }) {
  return (
    <button
      disabled={player !== turn}
      className="square"
      onClick={() => {
        onSquareClick(row, square);
      }}
    >
      {value}
    </button>
  );
}

export default Square;
