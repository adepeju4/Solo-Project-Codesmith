import React, { useEffect, useState } from "react";
import { useChatContext } from "stream-chat-react";
import { useDispatchComp } from "../lib/hooks";
import Modal from "../elements/Modal/Modal";

import JoinGameForm from "../elements/JoinGameForm/JoinGameForm";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import { StreamChat } from "stream-chat";
import Cookies from "universal-cookie";

function JoinGame() {
  const selectedGame = useStoreState((state) => state.activeGame);
  const [error, setError] = useState(null);
  const { client } = useChatContext();
  const navigate = useNavigate();
  const activeGame = useStoreState((state) => state.activeGame);
  const activeGamePath = useStoreState((state) => state.activeGamePath);
  const channel = useStoreState((state) => state.channel);
  const setChannel = useStoreActions((actions) => actions.setChannel);

  const rivals = useStoreState((state) => state.rivals);
  const setRivals = useStoreActions((state) => state.setRivals);

  const cookies = new Cookies();

  const token = cookies.get("token");

  const modalProps = {
    title: ":( Opps!",
    body: rivals.includes(client?.user?.name)
      ? "You cannot play with yourself :)"
      : `User ${rivals[0]} not found...`,
    dispatch: error,
    setDispatch: setError,
  };

  const createChannel = async () => {
    try {
      const queryPromises = rivals.map((rivalName) =>
        client.queryUsers({ name: { $eq: rivalName } })
      );

      const responses = await Promise.all(queryPromises);

      const foundUsers = responses
        .map((response) => response.users[0])
        .filter(Boolean);

      if (foundUsers.length > 0) {
        // Assuming you want to create a channel with all found users plus the current user
        const memberIds = foundUsers.map((user) => user.id);
        memberIds.push(client.userID); // Add current user's ID

        const newChannel = await client.channel("messaging", {
          members: memberIds,
        });

        await newChannel.watch();
        setChannel(newChannel);
        navigate(activeGamePath);
      } else {
        setError(true);
      }
    } catch (error) {
      modalProps.body = error.message;
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!activeGame) {
      navigate("/");
    }
  }, [channel]);

  return (
    <>
      <Navbar client={client} />

      <JoinGameForm
        game={selectedGame}
        client={client}
        onCreateChannel={createChannel}
        rivals={rivals}
        setRivals={setRivals}
      />

      {error && useDispatchComp(Modal, modalProps)}
    </>
  );
}

export default JoinGame;
