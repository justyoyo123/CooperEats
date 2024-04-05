import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const FoodItemDetailsModal = ({ show, onHide, foodName, details }) => {
  return (
    <Modal
      show={show} // Use the show prop here
      onHide={onHide} // Use the onHide prop here
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{foodName}</h4>
        <p>
          Description: {details.description}<br />
          Ingredients: {details.ingredients}<br />
          Allergens: {details.allergens}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button> {/* Use the onHide prop here */}
      </Modal.Footer>
    </Modal>
  );
};

export default FoodItemDetailsModal;
