import React from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai/index.js';

function BackButton({ handleBackButton }) {
  return (
    <button onClick={handleBackButton} id="back-btn">
      <AiOutlineArrowLeft />
    </button>
  );
}

export default BackButton;
