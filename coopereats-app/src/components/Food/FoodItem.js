// FoodItem.js
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import FoodItemDetailsModal from './FoodItemDetailsModal';
import foodDetails from './FoodDetails'; // Assuming you have a separate file for food details data

const FoodItem = ({ name }) => {
  const [modalShow, setModalShow] = useState(false);
  const details = foodDetails[name];

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Details
      </Button>

      <FoodItemDetailsModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        foodName={name}
        details={details}
      />
    </>
  );
};

export default FoodItem;
