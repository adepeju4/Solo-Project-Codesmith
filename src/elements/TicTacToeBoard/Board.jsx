import React, { useState, useRef, useEffect } from "react";
import { useChatContext } from "stream-chat-react";

import Modal from "../Modal/Modal";
import Row from "./Row";

const getInitState = () => {
  const initState = {
    rows: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    winner: "",
    player: "X",
    turn: "X",
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
      flattened[combo[0]] !== "" &&
      flattened[combo[0]] === flattened[combo[1]] &&
      flattened[combo[1]] === flattened[combo[2]]
  );
}

const nextMove = { X: "O", O: "X" };

let points = 0;

function Board({ channel, rivalName }) {
  let board = getInitState();
  const [won, setwon] = useState(false);
  const [dispatch, setDispatch] = useState(false);
  let { rows } = board;
  const { client } = useChatContext();

  const [squares, setSquares] = useState([]);

  const [playerPoints, setPlayerPoints] = useState(0);

  const values = useRef();
  const rivalPoints = useRef();

  useEffect(() => {
    setSquares(getSquares(rows));
  }, []);

  const callModal = (won) => {
    const modalProps = {
      title: won ? "Yay, you won!🎉🎉🎉🎉🎉" : "Sorry, you lost this round 🫠",
      body: "You can still continue with your partner, or leave the game",
      dispatch,
      setDispatch,
    };
    return modalProps;
  };

  const handleClick = (row, square) => {
    let { turn, winner, player } = board;

    const squareInQuestion = rows[row][square];

    if (turn !== player) return;

    if (board.winner) return;

    if (squareInQuestion) return;

    turn = turn === "X" ? "O" : "X";
    values.current.childNodes[row].childNodes[square].innerText =
      nextMove[turn];
    rows[row][square] = nextMove[turn];

    winner = checkWin(rows);

    if (winner) {
      setwon(true);
      setDispatch(true);
      points += 1;
      resetBoard();
      setPlayerPoints(points);
    }

    board = { ...board, turn, winner, player };

    channel?.sendEvent({
      type: "move",
      data: {
        row: [row, square],
        value: nextMove[turn],
        turn,
        winner,
        player,
        points,
      },
    });
  };

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
          values.current.childNodes[i].childNodes[j].innerHTML = "";
          rows[i][j] = "";
        }
      }
    }
  };

  const handleResetBoard = () => {
    resetBoard();

    points = 0;
    setPlayerPoints(points);
    channel?.sendEvent({
      type: "move",
      data: {
        reset: true,
        points: points,
      },
    });
  };

  channel?.on((event) => {
    if (event.type === "move" && event.user.id !== client.userID) {
      if (event?.data?.reset) {
        resetBoard();
        if (event?.data?.points) {
          points = 0;
          setPlayerPoints(points);
          rivalPoints.current.innerHTML = ``;
          rivalPoints.current.innerHTML = `${rivalName}: ${event?.data?.points}`;
        }
      } else {
        if (event?.data?.winner) {
          resetBoard();
          setwon(false);
          setDispatch(true);
          if (rivalPoints.current) {
            rivalPoints.current.innerHTML = ``;
            rivalPoints.current.innerHTML = `${rivalName}: ${event?.data?.points}`;
          }
        } else {
          board = {
            ...board,
            turn: event?.data?.turn,
            winner: event?.data?.winner,
            player: event?.data?.player === "X" ? "O" : "X",
          };

          callValues(event?.data?.row, event?.data?.value);
        }
      }
    }
  });

  return (
    <>
      <div className="board" id={"board"} ref={values}>
        {squares}
      </div>
      <div className="playerScreen">
        <div className="scoreBoard">
          <div className="playerScore">{`${client.user.name}: ${playerPoints}`}</div>
          <div
            className="rivalScore"
            ref={rivalPoints}
          >{`${rivalName}: ${0}`}</div>
        </div>
        <button id="reset" onClick={handleResetBoard}>
          Reset board
        </button>
      </div>

      {dispatch && <Modal {...callModal(won)} />}
    </>
  );
}

export default Board;
