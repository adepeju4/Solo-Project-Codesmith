import React, { useState } from 'react';
import Board from '../../elements/TicTacToeBoard/Board.js';

function TicTacToe({ channel }) {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );

  channel.on('user.watching.start', (event) => {
    setPlayersJoined(event.watcher_count === 2);
  });

  if (!playersJoined) {
    return <div>Waiting for other players to join</div>;
  }
  return (
    <div className="gameContainer">
      <Board />
      {/* TODO: CHAT*/}
      {/* {LEAVE GAME BTN} */}
    </div>
  );
}

export default TicTacToe;
