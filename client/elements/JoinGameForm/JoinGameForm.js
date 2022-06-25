import React from 'react';

function JoinGameForm({ game, client, onCreateChannel, setRivalName }) {
  return (
    <>
      <div className="joinGame">
        <label>Create Game</label>
        {game === 'Tic Tac Toe' || game === 'Chess' ? (
          <>
            <input
              type="text"
              placeholder="Username of rival..."
              onChange={(e) => setRivalName(e.target.value)}
            />
            <button onClick={onCreateChannel}> Join/Start Game</button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Username of rival..."
              onChange={(e) => setRivalName(e.target.value)}
              disabled
              value={client.user.name}
            />
            <input
              type="text"
              placeholder="Username of rival..."
              onChange={(e) => setRivalName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username of rival..."
              onChange={(e) => setRivalName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username of rival..."
              onChange={(e) => setRivalName(e.target.value)}
            />
            <button onClick={onCreateChannel}> Join/Start Game</button>
          </>
        )}
      </div>
    </>
  );
}

export default JoinGameForm;
