import React, { useState, useEffect } from 'react';
import fetcher from '../../lib/fetcher.js';

import Cookies from 'universal-cookie';

function SignUp() {
  const cookies = new Cookies();
  const [user, setUser] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await fetcher('Api/Auth/signup', user);

    if (result) {
      cookies.set('firstName', result.firstName);
      cookies.set('userName', result.userName);
      cookies.set('lastName', result.lastName);
      cookies.set('userId', result.userId);
      cookies.set('token', result.token);
      cookies.set('hashedPassword', result.password);
      setIsAuth(true);
    }
  };
  return (
    <div className="signUp">
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
        type="text"
        placeholder="Password"
        onChange={(e) => {
          setUser({ ...user, password: e.target.value });
        }}
      />

      <button type="submit" onClick={handleSubmit}>
        Sign Up
      </button>
    </div>
  );
}

export default SignUp;
