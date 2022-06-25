import React, { useState } from 'react';
import fetcher from '../../lib/fetcher.js';
import { useDispatchComp } from '../../lib/hooks.js';
import Modal from '../../elements/Modal/Modal.js';
import Cookies from 'universal-cookie';

function LogIn({ setIsAuth, setMode }) {
  const cookies = new Cookies();
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const [inputError, setinputError] = useState({});

  const modalProps = {
    title: ':( Opps!',
    body: error + ' 👀',
    dispatch: error,
    setDispatch: setError,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await fetcher('/Api/Auth/login', user);
    if (!result.err) {
      cookies.set('firstName', result.firstName);
      cookies.set('userName', result.userName);
      cookies.set('lastName', result.lastName);
      cookies.set('userId', result.userId);
      cookies.set('token', result.token);
      cookies.set('hashedPassword', result.password);

      setIsAuth(true);
      return;
    }

    setError(result.err);
  };
  return (
    <div className="login">
      <label> Log In</label>

      {inputError.userName && (
        <p className="inputError">Username not provided</p>
      )}
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => {
          setUser({ ...user, userName: e.target.value });
        }}
        onBlur={(e) => {
          if (!e.target.value) setinputError({ ...inputError, userName: true });
          else setinputError({ ...inputError, userName: false });
        }}
      />
      {inputError.password && (
        <p className="inputError">Password not provided</p>
      )}
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => {
          setUser({ ...user, password: e.target.value });
        }}
        onBlur={(e) => {
          if (!e.target.value) setinputError({ ...inputError, password: true });
          else setinputError({ ...inputError, password: false });
        }}
      />

      <div
        onClick={() => {
          setMode('signup');
        }}
      >
        Don't have an account? Sign up
      </div>

      <button type="submit" onClick={handleSubmit}>
        Log In
      </button>

      {error && useDispatchComp(Modal, modalProps)}
    </div>
  );
}

export default LogIn;
