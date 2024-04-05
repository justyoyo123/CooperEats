// FoodDetailsModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const FoodDetailsModal = ({ show, onHide, food }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{food.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Description</h4>
        <p>{food.description}</p>
        <h4>Price</h4>
        <p>${food.price}</p>
        {/* You can add more details here */}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FoodDetailsModal;
