import React, { useState } from 'react';
import Board from '../../elements/TicTacToeBoard/Board.js';
import { Window, MessageList, MessageInput } from 'stream-chat-react';

function TicTacToe({ channel }) {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );

  channel.on('user.watching.start', (event) => {
    setPlayersJoined(event.watcher_count === 2);
  });

  if (!playersJoined) {
    return <div className="loading">Waiting for other players to join...</div>;
  }
  return (
    <div className="gameContainer">
      <Board channel={channel} />
      {/* TODO: CHAT*/}

      {/* <Window>
        <MessageList
          disableDateSeparator
          closeReactionSelectorOnClick
          hideDeletedMessages
          messageActions={['react']}
        />
        <MessageInput noFiles publishTypingEvent />
      </Window> */}
      {/* {LEAVE GAME BTN} */}
    </div>
  );
}

export default TicTacToe;
