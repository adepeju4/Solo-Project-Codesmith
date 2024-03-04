import React, { useEffect, useState } from "react";
import Board from "../../elements/TicTacToeBoard/Board";
import { Window, MessageList, MessageInput, Channel } from "stream-chat-react";
import { useStoreState } from "easy-peasy";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";
import CustomInput from "../../elements/CustomInput";

function TicTacToe() {
  const client = StreamChat.getInstance(import.meta.env.VITE_KEY);
  const rivals = useStoreState((state) => state.rivals);
  const channel = useStoreState((state) => state.channel);
  const navigate = useNavigate();
  const [playersJoined, setPlayersJoined] = useState(
    channel?.state?.watcher_count === 2
  );

  useEffect(() => {
    if (!channel && !rivals.length) navigate("/");
  }, [channel, rivals]);

  const rivalName = rivals[0];

  channel?.on("user.watching.start", (event) => {
    setPlayersJoined(event.watcher_count === 2);
  });

  console.log(channel, "channel");
  if (!playersJoined) {
    return <div className="loading">Waiting for other players to join...</div>;
  }

  return (
    <div className="gameContainer">
      <Channel channel={channel} input={CustomInput}>
        <Navbar client={client} />
        <Board channel={channel} rivalName={rivalName} />
        {/* TODO: CHAT*/}

        <Window>
          <MessageList
            disableDateSeparator
            closeReactionSelectorOnClick
            hideDeletedMessages
            messageActions={["react"]}
          />
          <MessageInput noFiles publishTypingEvent />
        </Window>
        {/* {LEAVE GAME BTN} */}
      </Channel>
    </div>
  );
}

export default TicTacToe;
