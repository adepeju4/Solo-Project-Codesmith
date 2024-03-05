/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useChatContext } from "stream-chat-react";
import Rukia from "@/assets/randomPlayerImages/rukia.jpeg";
import Ichigo from "@/assets/randomPlayerImages/ichigo.jpeg";
import Modal from "../Modal/Modal";
import Row from "./Row";
import { Avatar, Tooltip } from "antd";
import { useStoreActions, useStoreState } from "easy-peasy";
import { v4 as uuidv4 } from "uuid";

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

function Board({ channel, rivalName }) {
  const { client } = useChatContext();
  const isGameCreator = channel.state.members[client.userID].role === "owner";
  const processedEventUUIDs = new Set();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showRivalTurn, setShowRivalTurn] = useState(false);
  const [gameOutcome, setGameOutcome] = useState("");
  const [wins, setWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [losses, setLosses] = useState(0);

  const { gameState } = useStoreState((state) => state);
  const { setGameState, setIsCreator, resetGame, setGame } = useStoreActions(
    (actions) => actions
  );

  const nextMove = { X: "O", O: "X" };

  const gameMessage = {
    win: "Yay, you won!🎉🎉🎉🎉🎉",
    loss: "Sorry, you lost this round 🫠",
    draw: "Welp, it's a draw. Try again? 🤔",
  };

  const callModal = () => {
    const modalProps = {
      title: gameMessage[gameOutcome],
      body: "You can still continue with your partner, or leave the game",
      dispatch: isModalVisible,
      setDispatch: setIsModalVisible,
    };
    return modalProps;
  };

  const handlePlayerMove = (rowIndex, columnIndex) => {
    if (
      rowIndex >= 0 &&
      rowIndex < gameState.rows.length &&
      columnIndex >= 0 &&
      columnIndex < gameState.rows[rowIndex].length
    ) {
      if (gameState.rows[rowIndex][columnIndex] !== "" || gameState.winner) {
        // Cell is already filled or the game has ended
        return;
      }

      const newRows = gameState.rows;

      newRows[rowIndex][columnIndex] = gameState.player;

      // Update the player's turn
      const nextPlayer = nextMove[gameState.turn];

      const isBoardFull = gameState.rows.flat().every((cell) => cell !== "");

      const winner = checkWin(newRows);

      if (winner) {
        setGameOutcome("win");
        setIsModalVisible(true);
      } else if (!winner && isBoardFull) {
        setGameOutcome("draw");
        setIsModalVisible(true);
      }

      // Continue the game without setting an outcome

      setGameState({
        rows: newRows,
        winner: winner && gameState.player,
        turn: nextPlayer,
      });
      // Send move through the channel
      const eventId = uuidv4();
      processedEventUUIDs.add(eventId);
      channel.sendEvent({
        type: "move",
        data: {
          id: eventId,
          turn: nextPlayer,
          winner: winner ? gameState.player : null,
          rowIndex,
          columnIndex,
          rows: newRows,
          player: gameState.player,
        },
      });
    }
  };
  const applyOpponentMove = (move) => {
    console.log({ move }, "when it gets here?");
    const { rowIndex, columnIndex, winner, player, turn, rows, id } = move;

    if (player === gameState.player) return;

    // First, check if the event ID has already been processed
    if (id && processedEventUUIDs.has(id)) {
      console.log(`Ignoring duplicate event: ${id}`);
      return; // Stop processing if it's a duplicate
    }

    console.log({ move }, `from ${player}`, "to", gameState.player);
    // If the move results in a win, update the game outcome to 'loss' for the current player
    if (winner) {
      setGameOutcome("loss");
      setIsModalVisible(true);
      // Since this is a valid event, mark it as processed
      processedEventUUIDs.add(id);
      return;
    }

    // Ensure the move is valid: the targeted cell is empty, and it's not the current player's move
    if (
      gameState.rows[rowIndex][columnIndex] === "" &&
      player !== gameState.player
    ) {
      console.log({ move }, "after passing the checks");
      // Here, instead of using a pre-defined newState, calculate the new state based on the previous state

      setGameState({ winner, turn, rows });

      // Mark the event as processed to prevent duplicate handling
      processedEventUUIDs.add(id);
    }
  };
  const handleGameReset = () => {
    resetGame({ isCreator: isGameCreator, turn: gameState.turn });
    setGameOutcome("");
    setIsModalVisible(false);

    channel.sendEvent({
      type: "reset-game",
    });
  };

  useEffect(() => {
    console.log({ channel });
    const handleChannelEvent = (event) => {
      console.log({ event }, "from channel");
      if (event.type === "move") {
        applyOpponentMove(event.data);
      } else if (event.type === "reset-game") {
        resetGame({ isCreator: isGameCreator, turn: gameState.turn });
      }
    };

    channel.on(handleChannelEvent);

    return () => channel.off("messaging", handleChannelEvent);
  }, [channel]);

  useEffect(() => {
    if (gameState.turn !== gameState.player) setShowRivalTurn(true);
    else setShowRivalTurn(false);
  }, [gameState]);

  useEffect(() => {
    if (gameOutcome === "win") {
      setWins((prevWins) => prevWins + 1);
    } else if (gameOutcome === "draw") {
      setDraws((prevDraws) => prevDraws + 1);
    } else if (gameOutcome === "loss") {
      setLosses((prevLosses) => prevLosses + 1);
    }

    // Reset game outcome states if necessary
  }, [gameOutcome]); // Depend on won, draw, lost

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      // Perform cleanup
      channel.off("messaging");
    });
  }

  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      window.location.reload();
    });
  }

  useEffect(() => {
    setGame({ isCreator: isGameCreator, turn: gameState.turn });
    setIsCreator(isGameCreator);
  }, []);
  return (
    <div className="flex-[.7] p-8 flex flex-col justify-center items-center h-full">
      <div>
        <Avatar size={64} src={Rukia} />
        <h3 className="text-center text-white text-large">
          {client?.user?.name} (Me)
        </h3>
      </div>

      <div className="board" id={"board"}>
        {(gameState.rows || []).map((row, rowIndex) => (
          <Row
            turn={gameState.turn}
            player={gameState.player}
            key={rowIndex}
            columns={row}
            row={rowIndex}
            rowIndex={rowIndex}
            onSquareClick={handlePlayerMove}
          />
        ))}

        <div className="text-center">
          <p>Wins</p>
          <p>{wins}</p>
        </div>

        <div className="text-center">
          <p>Losses</p>
          <p>{losses}</p>
        </div>
        <div className="text-center">
          <p>draws</p>
          <p>{draws}</p>
        </div>
        <button onClick={handleGameReset}>Reset board</button>
      </div>
      <div>
        <Tooltip
          placement="right"
          title={"My Turn"}
          color="white"
          open={showRivalTurn}
        >
          <Avatar size={64} src={Ichigo} />
          <h3 className="text-center text-white text-large">{rivalName}</h3>
        </Tooltip>
      </div>
      {/* <div className="playerScreen">
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
      </div> */}

      {isModalVisible && <Modal {...callModal()} />}
    </div>
  );
}

export default Board;
