import React, { useState } from 'react';

import SignUp from './Auth/SignUp.js';
import Login from './Auth/Login.js';
import '../scss/global.scss';
import { StreamChat } from 'stream-chat';
import Cookies from 'universal-cookie';
import JoinGame from './JoinGame.js';
import { Chat } from 'stream-chat-react';
import Star from '../assets/bigStar.svg';
import rocket1 from '../assets/6-removebg-preview 1.svg';
import rocket2 from '../assets/5-removebg-preview 1.svg';
import smallStar from '../assets/smallStar1.svg';

function App() {
  const cookies = new Cookies();

  const client = StreamChat.getInstance(process.env.KEY);
  const token = cookies.get('token');

  const [isAuth, setIsAuth] = useState(false);
  const [mode, setMode] = useState('signup');

  if (token) {
    client
      .connectUser(
        {
          id: cookies.get('userId'),
          name: cookies.get('userName'),
          firstName: cookies.get('firstName'),
          lastName: cookies.get('lastName'),
          hashedPassword: cookies.get('hashedPassword'),
        },
        token
      )
      .then((user) => {
        setIsAuth(true);
      });
  }

  const bigStars = [
    <img src={Star} key={1} />,
    <img src={Star} key={2} />,
    <img src={Star} key={3} />,
  ];

  const rockets = [
    <img className="rocket-left" src={rocket1} key={1} />,
    <img className="rocket-right" src={rocket2} key={2} />,
  ];

  const shootingStars = [
    <section>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </section>,
  ];

  const handleLogOut = () => {
    cookies.remove('userId');
    cookies.remove('userName');
    cookies.remove('firstName');
    cookies.remove('lastName');
    cookies.remove('hashedPassword');
    cookies.remove('token');
    client.disconnectUser();
    setIsAuth(false);
  };
  return (
    <div className="App">
      <>
        {isAuth ? (
          <Chat client={client}>
            <>
              <JoinGame />
              <button onClick={handleLogOut}>Log out</button>
            </>
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
            {rockets}
          </div>
        )}
        {shootingStars}
      </>
    </div>
  );
}

export default App;
