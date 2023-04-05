import { AddShoppingCartOutlined } from "@mui/icons-material";
// import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  const token = window.localStorage.getItem("token");
  // const [items, setItems] = useState([]);
  // let data = 
  // {
  // "name":"Tan Leatherette Weekender Duffle",
  // "category":"Fashion",
  // "cost":150,
  // "rating":4,
  // "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  // "_id":"PmInA797xJhMIPti"
  // }




  return (
    <Card className="card">
      <CardMedia
          component="img"
          height="140"
          image={product.image}
          alt="VideoPreview"
        />
        <Typography gutterBottom variant="h5">
            {product.name}
          </Typography>
        <Typography gutterBottom variant="h5">
        ${product.cost}
          </Typography>
          <Rating name="half-rating-read" defaultValue={product.rating} precision={0.5} readOnly />

          <Button
            className="card-button"
            name="add to cart"
            variant="contained"
            startIcon={<AddShoppingCartOutlined />}
            fullWidth
            // component="div"
            // value={product.id}
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>
          {/* {console.log(product)} */}
    </Card>
  );
};

export default ProductCard;
