import React, { useState, useEffect } from 'react';
import Row from './Row.js';

const getInitState = () => {
  const initState = {
    rows: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
    winner: '',
    nextMove: 'X',
  };
  return initState;
};

function checkWin(rows) {
  const combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  const flattened = rows.reduce((acc, row) => acc.concat(row), []);

  return combos.find(
    (combo) =>
      flattened[combo[0]] !== '' &&
      flattened[combo[0]] === flattened[combo[1]] &&
      flattened[combo[1]] === flattened[combo[2]]
  );
}

function Board() {
  const [board, setBoard] = useState(getInitState());
  const { rows } = board;

  const handleClick = (row, square) => {
    let { turn, winner } = board;

    const squareInQuestion = rows[row][square];

    if (board.winner) return;
    if (squareInQuestion) return;
    turn = turn === 'X' ? 'O' : 'X';
    rows[row][square] = turn;

    winner = checkWin(rows);

    setBoard({
      rows,
      turn,
      winner,
    });
  };

  return (
    <>
      <div className="board" id={'board'}>
        {rows.map((text, index) => {
          return (
            <Row
              row={index}
              chooseSquare={handleClick}
              columns={text}
              key={`rowKey${index}xx`}
            />
          );
        })}
      </div>
      <button id="reset" onClick={() => setBoard(getInitState())}>
        Reset board
      </button>
    </>
  );
}

export default Board;
