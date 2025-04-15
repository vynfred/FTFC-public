import React, { createContext, useContext, useState } from 'react';

/**
 * Modal Context
 * 
 * This context manages the state of all modals in the application.
 * It provides functions to open and close modals, and stores data
 * that needs to be passed to the modals.
 */
const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState({
    scheduleMeeting: { isOpen: false, data: null },
    uploadDocument: { isOpen: false, data: null },
    createLead: { isOpen: false, data: null },
    addAttendee: { isOpen: false, data: null },
    addMilestone: { isOpen: false, data: null },
    addNote: { isOpen: false, data: null },
    addActivity: { isOpen: false, data: null },
    convertToClient: { isOpen: false, data: null }
  });

  const openModal = (modalName, data = null) => {
    setModals(prev => ({
      ...prev,
      [modalName]: { isOpen: true, data }
    }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({
      ...prev,
      [modalName]: { isOpen: false, data: null }
    }));
  };

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
