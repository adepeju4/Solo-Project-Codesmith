import React, { useState } from 'react';
import { useDispatchComp } from '../../lib/hooks.js';
import { AnimatePresence } from 'framer-motion';
import ModalContent from './ModalContent.js';

function Modal({ ...props }) {
  const [modalOpen, setModalOpen] = useState(props.dispatch ? true : false);

  return (
    <>
      <AnimatePresence>
        {modalOpen &&
          useDispatchComp(ModalContent, {
            ...props,
            setOpenModal: setModalOpen,
          })}
      </AnimatePresence>

      {!props.dispatch && (
        <button
          className="openModalBtn"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Open
        </button>
      )}
    </>
  );
}

export default Modal;
