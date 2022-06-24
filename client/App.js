import React, { useState } from 'react';

import './scss/global.scss';
import { StreamChat } from 'stream-chat';
import Cookies from 'universal-cookie';

import ShootingStars from './elements/ShootingStars.js';

import Home from './pages/Home.js';
import { StoreProvider } from 'easy-peasy';
import store from './lib/store.js';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const cookies = new Cookies();

  const client = StreamChat.getInstance(process.env.KEY);

  const token = cookies.get('token');
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
      <StoreProvider store={store}>
        <Home
          isAuth={isAuth}
          setIsAuth={setIsAuth}
          handleLogOut={handleLogOut}
          client={client}
        />
        <ShootingStars />
      </StoreProvider>
    </div>
  );
}

export default App;
