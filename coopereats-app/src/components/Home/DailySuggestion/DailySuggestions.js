import React, { useState } from "react";
import { MenuList } from "./SuggestiedMenu";
import Layout from "./Layout";
import './DailySuggestion.css'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Fade,
  Backdrop
} from "@mui/material";
import Modal from '@mui/material/Modal';
import { Margin } from "@mui/icons-material";


const DailySuggestion = () => {
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const handleOpen = (menu) => {
    setSelectedMenu(menu);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="daily-suggestions-container">
      <h1 className='cardd'>Daily Suggestions</h1>
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
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
                  sx={{
                    height: 233,
                    width: 350,
                    maxHeight: { xs: 233, md: 167 },
                    maxWidth: { xs: 350, md: 250 },
                    Margin: 10
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
                  {/* Add other nutritional info here */}
                </Typography>
              </>
            )}
          </Box>
        </Fade>
      </Modal>


    </div>
  );
};

export default DailySuggestion;