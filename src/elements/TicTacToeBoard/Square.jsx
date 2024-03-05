/* eslint-disable react/prop-types */
import React from "react";

function Square({ rivalTurn, value, row, square, onSquareClick }) {
  return (
    <button
      disabled={rivalTurn}
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
