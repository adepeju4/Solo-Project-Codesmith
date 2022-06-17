import React, { useState } from 'react';

import SignUp from './Auth/SignUp.js';
import Login from './Auth/Login.js';
import '../scss/global.scss';
import { StreamChat } from 'stream-chat';
import Cookies from 'universal-cookie';

function App() {
  const cookies = new Cookies();

  const client = StreamChat.getInstance(process.env.KEY);
  const token = cookies.get('token');

  const [isAuth, setIsAuth] = useState(false);

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
        process.env.NODE_ENV === 'development' && console.log(user);
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
      {isAuth ? (
        <button onClick={handleLogOut}>Log out</button>
      ) : (
        <>
          <SignUp setIsAuth={setIsAuth} />
          <Login setIsAuth={setIsAuth} />
        </>
      )}
    </div>
  );
}

export default App;
