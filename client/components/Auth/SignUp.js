import React, { useState } from 'react';
import fetcher from '../../lib/fetcher.js';
import { useDispatchComp } from '../../lib/hooks.js';
import Modal from '../../elements/Modal/Modal.js';
import Cookies from 'universal-cookie';

function SignUp({ setIsAuth, setMode }) {
  const cookies = new Cookies();
  const [user, setUser] = useState({});
  const [error, setError] = useState(false);

  const modalProps = {
    title: ':( Opps!',
    body: `Something went wrong :( ... please try again later`,
    dispatch: error,
    setDispatch: setError,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await fetcher('Api/Auth/signup', user);

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
    setError(true);
  };
  return (
    <div className="signup">
      <label> Sign Up</label>
      <input
        type="text"
        placeholder="First Name"
        onChange={(e) => {
          setUser({ ...user, firstName: e.target.value });
        }}
      />

      <input
        type="text"
        placeholder="Last Name"
        onChange={(e) => {
          setUser({ ...user, lastName: e.target.value });
        }}
      />

      <input
        type="text"
        placeholder="Username"
        onChange={(e) => {
          setUser({ ...user, userName: e.target.value });
        }}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => {
          setUser({ ...user, password: e.target.value });
        }}
      />
      <div
        onClick={() => {
          setMode('login');
        }}
      >
        Already signed up? Log in
      </div>
      <button type="submit" onClick={handleSubmit}>
        Sign Up
      </button>

      {error && useDispatchComp(Modal, modalProps)}
    </div>
  );
}

export default SignUp;
