import React, { useState } from 'react';
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

let called = false;

const nextMove = { X: 'O', O: 'X' };

function Board({ channel }) {
  const [board, setBoard] = useState(getInitState());
  const [dispatch, setdispatch] = useState(false);
  const { rows } = board;
  const { client } = useChatContext();

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
    rows[row][square] = nextMove[turn];

    winner = checkWin(rows);

    if (winner) setdispatch(true);

    setBoard({
      rows,
      turn,
      winner,
      player,
    });

    channel.sendEvent({
      type: 'move',
      data: {
        board: {
          rows,
          turn,
          winner,
        },
        player,
      },
    });
  };

  const callBoard = (boardd, player) => {
    if (boardd.winner) {
      setdispatch(true);
    } else {
      setBoard({ ...boardd, player: player === 'X' ? 'O' : 'X' });
    }
    called = false;
  };

  // Peju1234 MattBucks

  channel.on((event) => {
    if (event.type === 'move' && event.user.id !== client.userID) {
      if (!called) {
        callBoard(event.data.board, event.data.player);
      }
    }
  });

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
      <button
        id="reset"
        onClick={() => {
          setBoard(getInitState());
          channel.sendEvent({
            type: 'move',
            data: { board: getInitState() },
          });
        }}
      >
        Reset board
      </button>

      {dispatch && <Modal {...callModal(board.winner)} />}
    </>
  );
}

export default Board;
