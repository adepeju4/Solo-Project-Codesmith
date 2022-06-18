import React, { useState, useEffect } from 'react';
import { useChatContext, Channel } from 'stream-chat-react';
import { useDispatchComp } from '../lib/hooks.js';
import Modal from '../elements/Modal/Modal.js';
import TicTacToe from './Game/TicTacToe.js';

function JoinGame() {
  const [rivalName, setRivalName] = useState('');

  const { client } = useChatContext();

  const [channel, setChannel] = useState(null);

  const [dispatch, setDispatch] = useState(false);

  const modalProps = {
    title: ':( Opps!',
    body: `User ${rivalName} not found...`,
    dispatch,
    setDispatch,
  };

  const createChannel = async () => {
    const response = await client.queryUsers({ name: { $eq: rivalName } });

    if (response.users.length > 0) {
      const newChannel = await client.channel('messaging', {
        members: [client.userID, response.users[0].id],
      });

      await newChannel.watch();
      setChannel(newChannel);
      console.log(newChannel);
    } else {
      setDispatch(true);
    }
  };

  return (
    <>
      {channel ? (
        <Channel channel={channel}>
          <TicTacToe channel={channel} />
        </Channel>
      ) : (
        <div>
          <h4>Create Game</h4>
          <input
            type="text"
            placeholder="Username of rival..."
            onChange={(e) => setRivalName(e.target.value)}
          />

          <button onClick={createChannel}> Join/Start Game</button>
        </div>
      )}

      {dispatch && useDispatchComp(Modal, modalProps)}
    </>
  );
}

export default JoinGame;
