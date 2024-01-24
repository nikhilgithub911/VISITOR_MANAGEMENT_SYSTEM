import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import image from "../assets/fold1.svg";
// import "./Pop.css";
import "../css/Pop.css"

const Pop = ({ onClose }) => {
  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modalContainer">
        <img className="modalImage" src={image} alt="thank you" />
        <p className="modalTitle">
          Thank you for visiting 
        </p>
       
      </Box>
    </Modal>
  );
};

export default Pop;
