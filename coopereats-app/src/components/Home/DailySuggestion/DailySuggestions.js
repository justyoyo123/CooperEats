import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { MenuList } from "./SuggestiedMenu";
import Layout from "./Layout";
import './DailySuggestion.css';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Fade,
  Modal,
  Button, // Make sure Button is imported if not already
} from "@mui/material";

const DailySuggestion = () => {
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  const handleOpen = (menu) => {
    setSelectedMenu(menu);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleExploreMore = () => {
    navigate('/food'); // Navigate to the food page
    handleClose(); // Optionally close the modal after navigation
  };

  return (
    <div className="daily-suggestions-container">
      <h1 className='cardd'>Best Sellers</h1>
      <Layout>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {MenuList.map((menu, index) => (
            <Card sx={{ maxWidth: "390px", display: "flex", m: 2 }} key={index}>
              <CardActionArea onClick={() => handleOpen(menu)}>
                <CardMedia
                  sx={{ minHeight: "400px" }}
                  component="img"
                  src={menu.image}
                  alt={menu.name}
                />
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: '520' }}>
                    {menu.name}
                  </Typography>
                  <Typography variant="body2">{menu.description}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Layout>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'auto',
              maxWidth: '600px',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              outline: 'none',             
            }}
          >
            {selectedMenu && (
              <>
                <Typography id="modal-modal-title" variant="h5" component="h3" className="modalTitle">
                  {selectedMenu.name}
                </Typography>
                <img
                  src={selectedMenu.image}
                  alt={selectedMenu.name}
                  style={{
                    height: 330,
                    width: 350,
                    margin: 10,
                    borderRadius: '8px' // Rounded corners for the image
                  }}
                />
                <Typography id="modal-modal-description" sx={{ mt: 2 }} className="modalDescription">
                  {selectedMenu.detailedDescription}
                </Typography>
                <Typography sx={{ mt: 2 }} className="modalIngredients">
                  Ingredients: {selectedMenu.ingredients.join(', ')}
                </Typography>
                <Typography sx={{ mt: 2 }} className="modalNutritionalInfo">
                  Calories: {selectedMenu.nutritionalInfo.calories}
                </Typography>
                <Button
                color="primary"
                onClick={handleExploreMore}
                sx={{
                  mt: 2,
                  padding: '6px 12px', // Reduces padding to make the button smaller
                  fontSize: '0.875rem', // Smaller font size
                }}
              >
                Explore More Food
              </Button>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default DailySuggestion;
