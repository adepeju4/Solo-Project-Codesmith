import React from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai/index.js';

import PropTypes from 'prop-types';

function BackButton({ handleBackButton }) {
  return (
    <button onClick={handleBackButton} id="back-btn">
      <AiOutlineArrowLeft />
    </button>
  );
}

BackButton.propTypes = {
  handleBackButton: PropTypes.func.isRequired,
};

export default BackButton;
