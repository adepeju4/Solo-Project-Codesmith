import React, { useState } from "react";

function JoinGameForm({
  game,

  onCreateChannel,
  setRivals,
}) {
  // Use state to handle input for multiple rivals
  const [rivalInputs, setRivalInputs] = useState([""]);

  // Handle change for single rival games
  const handleChangeSingle = (e) => {
    setRivals([e.target.value]); // Store in an array for consistency
  };

  // Handle change for inputs in games that allow multiple rivals
  const handleChangeMultiple = (index, value) => {
    const updatedRivals = [...rivalInputs];
    updatedRivals[index] = value;
    setRivalInputs(updatedRivals);
    setRivals(updatedRivals.filter(Boolean)); // Update parent state, filter out empty strings
  };

  // Add another input for multiple rivals
  const addRivalInput = () => {
    setRivalInputs([...rivalInputs, ""]);
  };

  return (
    <div className="joinGame">
      <label>Create Game</label>
      {game === "Tic Tac Toe" || game === "Chess" ? (
        <>
          <input
            type="text"
            placeholder="Username of rival..."
            onChange={handleChangeSingle}
          />
          <button onClick={onCreateChannel}>Join/Start Game</button>
        </>
      ) : (
        <>
          {rivalInputs.map((_, index) => (
            <input
              key={index}
              type="text"
              placeholder="Username of rival..."
              onChange={(e) => handleChangeMultiple(index, e.target.value)}
            />
          ))}

          <div className="join--cta">
            <button type="button" onClick={addRivalInput}>
              Add Another Rival
            </button>
            <button onClick={onCreateChannel}>Join/Start Game</button>
          </div>
        </>
      )}
    </div>
  );
}

export default JoinGameForm;
