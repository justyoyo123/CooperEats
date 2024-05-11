// FoodItem.js
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import FoodItemDetailsModal from './FoodItemDetailsModal';
import foodDetails from './FoodDetails';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {IconButton} from '@mui/material';

const FoodItem = ({ name, foodId}) => {
  const [modalShow, setModalShow] = useState(false);
  const details = foodDetails[name];

  return (
    <>
      <IconButton onClick={()=>setModalShow(true)}><AddCircleIcon fontSize='large'/></IconButton>

      <FoodItemDetailsModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        foodName={name}
        details={details}
        foodId={foodId}
      />
    </>
  );
};

export default FoodItem;
