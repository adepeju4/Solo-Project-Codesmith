import React from 'react';

function Square({ value, row, square, chooseSquare }) {
  return (
    <div
      className="square"
      onClick={() => {
        chooseSquare(row, square);
      }}
    >
      {value}
    </div>
  );
}

export default Square;
