import React, { useState } from "react";

import "./scss/global.scss";
import TicTacToe from "./components/Game/TicTacToe";
import Ludo from "./components/Game/Ludo";
import Chess from "./components/Game/Chess";
import { StoreProvider } from "easy-peasy";
import store from "./lib/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./components/Auth/SignUp";
import LogIn from "./components/Auth/Login";
import ShootingStars from "./elements/ShootingStars";

import ChooseGame from "./components/ChooseGame";
import Provider from "./components/Provider";
import Layout from "./pages/Layout.jsx";
import JoinGame from "./components/JoinGame.jsx";

import Cookies from "universal-cookie";
import { StreamChat } from "stream-chat";

function App() {
  const [user, setUser] = useState(null);
  const cookies = new Cookies();

  const client = StreamChat.getInstance(import.meta.env.VITE_KEY);

  const token = cookies.get("token");

  if (token) {
    client
      .connectUser(
        {
          id: cookies.get("userId"),
          name: cookies.get("userName"),
          firstName: cookies.get("firstName"),
          lastName: cookies.get("lastName"),
          hashedPassword: cookies.get("hashedPassword"),
        },
        token
      )
      .then((user) => {
        setUser(user);
      });
  }

  const router = createBrowserRouter([
    {
      path: "/signup",
      element: (
        <Layout>
          <SignUp />
        </Layout>
      ),
    },
    {
      path: "/login",
      element: (
        <Layout>
          <LogIn />
        </Layout>
      ),
    },
    {
      path: "/",
      element: (
        <Provider user={user}>
          <ChooseGame />,
        </Provider>
      ),
    },
    {
      path: "/join",
      element: (
        <Provider user={user}>
          <JoinGame />,
        </Provider>
      ),
    },
    {
      path: "tic-tac-toe",
      element: (
        <Provider user={user}>
          <TicTacToe />,
        </Provider>
      ),
    },
    { path: "ludo", element: <Ludo /> },
    { path: "chess", element: <Chess /> },
  ]);

  return (
    <div className="App">
      <StoreProvider store={store}>
        <RouterProvider router={router} />
        <ShootingStars />
      </StoreProvider>
    </div>
  );
}

export default App;
