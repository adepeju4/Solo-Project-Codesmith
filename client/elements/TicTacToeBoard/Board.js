import { get } from 'mongoose';
import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';

import Modal from '../Modal/Modal.js';
import Row from './Row.js';

const getInitState = () => {
  const initState = {
    rows: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
    winner: '',
    player: 'X',
    turn: 'X',
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

const nextMove = { X: 'O', O: 'X' };

function Board({ channel }) {
  let board = getInitState();
  const [won, setwon] = useState(false);
  const [dispatch, setdispatch] = useState(false);
  let { rows } = board;
  const { client } = useChatContext();

  const [squares, setSquares] = useState([]);

  const values = useRef();

  const callModal = (won) => {
    const modalProps = {
      title: won ? 'Yay, you won!🎉🎉🎉🎉🎉' : 'Sorry, you lost this round 🫠',
      body: 'You can still continue with your partner, or leave the game',
      dispatch,
      setdispatch,
    };
    return modalProps;
  };

  const handleClick = (row, square) => {
    let { turn, winner, player } = board;

    const squareInQuestion = rows[row][square];

    if (turn !== player) return;

    if (board.winner) return;

    if (squareInQuestion) return;

    turn = turn === 'X' ? 'O' : 'X';
    values.current.childNodes[row].childNodes[square].innerText =
      nextMove[turn];
    rows[row][square] = nextMove[turn];

    winner = checkWin(rows);

    if (winner) {
      setwon(true);
      setdispatch(true);
      console.log(client.user.name, 'won!', dispatch);
      resetBoard();
    }

    board = { ...board, turn, winner, player };

    channel.sendEvent({
      type: 'move',
      data: {
        row: [row, square],
        value: nextMove[turn],
        turn,
        winner,
        player,
      },
    });
  };

  useEffect(() => {
    console.log(dispatch);
  }, [dispatch]);

  const getSquares = (vals) => {
    return vals.map((text, index) => {
      return (
        <Row
          row={index}
          chooseSquare={handleClick}
          columns={text}
          key={`rowKey${index}xx`}
        />
      );
    });
  };

  const callValues = (position, value) => {
    if (values.current) {
      values.current.childNodes[position[0]].childNodes[position[1]].innerHTML =
        value;
      board.rows[position[0]][position[1]] = value;
    }
  };

  const resetBoard = () => {
    if (values.current) {
      board = getInitState();
      for (let i = 0; i < board.rows.length; i++) {
        for (let j = 0; j < board.rows.length; j++) {
          values.current.childNodes[i].childNodes[j].innerHTML = '';
          rows[i][j] = '';
        }
      }
    }
  };

  useEffect(() => {
    setSquares(getSquares(rows));
  }, []);

  channel.on((event) => {
    if (event.type === 'move' && event.user.id !== client.userID) {
      if (event.data.reset) {
        resetBoard();
      } else {
        if (event.data.winner) {
          resetBoard();
          setwon(false);
          setdispatch(true);
        } else {
          board = {
            ...board,
            turn: event.data.turn,
            winner: event.data.winner,
            player: event.data.player === 'X' ? 'O' : 'X',
          };
          callValues(event.data.row, event.data.value);
        }
      }
    }
  });

  return (
    <>
      <div className="board" id={'board'} ref={values}>
        {squares}
      </div>
      <button
        id="reset"
        onClick={() => {
          resetBoard();
          channel.sendEvent({
            type: 'move',
            data: {
              reset: true,
            },
          });
        }}
      >
        Reset board
      </button>

      {dispatch && <Modal {...callModal(won)} />}
    </>
  );
}

export default Board;
