import React, { useState } from 'react';

function LogIn() {
  const [user, setUser] = useState({});
  const handleSubmit = () => {};
  return (
    <div className="signUp">
      <label> Login</label>
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
        Log In
      </button>
    </div>
  );
}

export default LogIn;
