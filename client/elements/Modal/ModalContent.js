import React from 'react';
import { motion } from 'framer-motion';

function ModalContent({ title, body, setOpenModal }) {
  const modalContentAnimate = {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { delay: 0.3 } },
    exiit: { x: 100, opacity: 0 },
  };

  return (
    <motion.div
      className="modalBackground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0 }}
      onClick={() => {
        setOpenModal(false);
      }}
    >
      <motion.div
        className="modalContainer"
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { duration: 0.3 } }}
        exit={{ scale: 0 }}
      >
        <motion.div className="title" {...modalContentAnimate}>
          <h1>{title}</h1>
        </motion.div>
        <motion.div className="body" {...modalContentAnimate}>
          <p>{body}</p>
        </motion.div>
        <motion.div className="footer" {...modalContentAnimate}>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button>Continue</button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ModalContent;