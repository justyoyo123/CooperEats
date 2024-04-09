import React from "react";
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
} from "@mui/material";


const DailySuggestion = () => {
  return (
    <div className="daily-suggestions-container"> {/* This div wraps the entire content */}
      <h1 className='cardd' id='cardd'>Daily Suggestions</h1>
      <Layout>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {MenuList.map((menu) => (
            <Card sx={{ maxWidth: "390px", display: "flex", m: 2 }}>
              <CardActionArea>
                <CardMedia
                  sx={{ minHeight: "400px" }}
                  component={"img"}
                  src={menu.image}
                  alt={menu.name}
                />
                <CardContent>
                  <Typography variant="h5" gutterBottom component={"div"} style={{fontWeight: 'bold'}}>
                    {menu.name}
                  </Typography>
                  <Typography variant="body2">{menu.description}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Layout>
    </div>
  );
};


export default DailySuggestion;