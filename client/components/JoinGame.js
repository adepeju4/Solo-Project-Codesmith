import React, { useState } from 'react';
import { useChatContext, Channel } from 'stream-chat-react';
import { useDispatchComp } from '../lib/hooks.js';
import Modal from '../elements/Modal/Modal.js';
import TicTacToe from './Game/TicTacToe.js';
import Ludo from './Game/Ludo.js';
import Chess from './Game/Chess.js';
import CustomInput from '../elements/CustomInput.js';
import JoinGameForm from '../elements/JoinGameForm/JoinGameForm.js';
import { useStoreState, useStoreActions } from 'easy-peasy';
import BackButton from '../elements/BackButton.js';

function JoinGame() {
  const selectedGame = useStoreState((state) => state.activeGame);
  const setGame = useStoreActions((state) => state.setActiveGame);

  const [rivalName, setRivalName] = useState('');

  const { client } = useChatContext();

  const [channel, setChannel] = useState(null);

  const [dispatch, setDispatch] = useState(false);

  const gamesList = {
    'Tic tac toe': <TicTacToe channel={channel} client={client} />,
    Ludo: <Ludo channel={channel} client={client} />,
    Chess: <Chess channel={channel} client={client} />,
  };

  const modalProps = {
    title: ':( Opps!',
    body:
      rivalName === client.user.name
        ? 'You cannot play with yourself :)'
        : `User ${rivalName} not found...`,
    dispatch,
    setDispatch,
  };

  const createChannel = async () => {
    const response = await client.queryUsers({ name: { $eq: rivalName } });

    try {
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
    } catch (error) {
      setDispatch(true);
    }
  };

  const handleBack = () => {
    setGame('');
  };

  return (
    <>
      <BackButton handleBackButton={handleBack} />
      {channel ? (
        <Channel channel={channel} input={CustomInput}>
          {gamesList[selectedGame]}
        </Channel>
      ) : (
        <JoinGameForm
          game={selectedGame}
          client={client}
          onCreateChannel={createChannel}
          setRivalName={setRivalName}
        />
      )}

      {dispatch && useDispatchComp(Modal, modalProps)}
    </>
  );
}

export default JoinGame;
