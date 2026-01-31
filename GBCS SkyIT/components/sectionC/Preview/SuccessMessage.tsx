import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const SuccessMessage = ({ show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton onHide={onClose}></Modal.Header>
      <Modal.Body>
        <p>Responses are added to Response Library Successfully.</p>
      </Modal.Body>
    </Modal>
  );
};

export default SuccessMessage;


