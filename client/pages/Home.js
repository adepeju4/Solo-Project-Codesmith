import SignUp from '../components/Auth/SignUp.js';
import Login from '../components/Auth/Login.js';

import { Chat } from 'stream-chat-react';
import Star from '../assets/bigStar.svg';
import ChooseGame from '../components/ChooseGame.js';

import React, { useState } from 'react';

function Home({ setIsAuth, isAuth, handleLogOut, client }) {
  const [mode, setMode] = useState('signup');

  const bigStars = [
    <img src={Star} key={1} />,
    <img src={Star} key={2} />,
    <img src={Star} key={3} />,
  ];

  return (
    <>
      {isAuth ? (
        <Chat client={client}>
          <ChooseGame />
        </Chat>
      ) : (
        <div className="authContainer">
          <div className="gameName">
            <div>Games FM</div>
            {bigStars}
          </div>
          {mode === 'signup' ? (
            <SignUp setIsAuth={setIsAuth} setMode={setMode} />
          ) : (
            <Login setIsAuth={setIsAuth} setMode={setMode} />
          )}
        </div>
      )}
      <button onClick={handleLogOut} id="logout">
        Log Out
      </button>
    </>
  );
}

export default Home;
