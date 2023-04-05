import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart from "./Cart";
import { generateCartItemsFrom } from "./Cart";

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [Liste, setListe] = useState([]);
  const [loading, setloading] = useState(false);
  const [search, setsearch] = useState("");
  const [timer, settimer] = useState(null);
  const [notgot, setnotgot] = useState(false);
  const [items , setItems] = useState([])
  const [detailedItems, setDetailedItems] = useState({});
  // let items = [];
  // let detailedItems = [];
  let token = "";

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setloading(true);

    try {
      let res = await axios.get(`${config.endpoint}/products`);
      setListe(res.data);
      setloading(false);

      // return res.data;
    } catch (e) {
      console.log(e);
      setloading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      let resp = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setListe(resp.data);
      setnotgot(false);
    } catch (e) {
      if (e.response) {
        if (e.response.status === 404) {
          setnotgot(true);
          setListe([]);
        }
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    let querye = event.target.value;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    let newSearch = setTimeout(async () => {
      await performSearch(querye);
    }, 500);

    settimer(newSearch);
  };

  const handleChange = (e) => {
    setsearch(e.target.value);
  };

  useEffect(() => {
    performAPICall();
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      fetchCart(window.localStorage.getItem("token"))
        .then((cartItem) => {
          // console.log(cartItem);
          setItems(cartItem);
          return generateCartItemsFrom(cartItem, Liste);
        })
        .then((res) => {
          setDetailedItems(res);
          // console.log(detailedItems)
        });
    }
  }, [Liste]);

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;
    // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    try {
      const res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res.data);
      return res.data;
    } catch (e) {
      console.log(e);
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
   const isItemInCart = (items, productId) => {
    //  console.log(items);
     // if (items.map((items) => items[0].productId === productId)) {
       //   // console.log(items.productId, productId);
       //   return true;
       // } else {
         //   return false;
         // }
         if(items.length === 0){
           return false;
          }
          // console.log(items[0].productId, "           ", productId);

    for(let i = 0; i<items.length; i++){
      if(items[i].productId === productId){
        return true;
      }
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {

    // console.log(token, items, products, productId, qty);
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        varient: "warning",
      });
      return;
    }

    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar("Item already in cart", { variant: "warning" });
      return;
    }


    try{
      console.log(detailedItems);
      let res = await axios.post(`${config.endpoint}/cart`, {productId, qty}, {headers:{Authorization:`Bearer ${token}`}});
      // console.log(res);
      const cartItems = generateCartItemsFrom(res.data, Liste);
      console.log(cartItems);
      setDetailedItems(cartItems);
      console.log(detailedItems);

    }catch(e){
      console.log(e);
      console.log("error hai");
    }
  };


  
  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          size="large"
          // fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          className=".search-desktop"
          placeholder="Search for items/categories"
          name="search"
          // value={search}
          onChange={(e) => {
            debounceSearch(e, timer);
          }}
        />

        {/* Search view for mobiles */}
        <TextField
          className="search-mobile"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          // value={search}
          onChange={(e) => {
            debounceSearch(e, timer);
          }}
        />
      </Header>

      <Grid container>
        <Grid
          item
          className="product-grid"
          xs={12}
          md={window.localStorage.getItem("username") && Liste.length ? 9 : 12}
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          {loading ? (
            <Box
              className="loading"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <CircularProgress />
              Loading Products
            </Box>
          ) : notgot ? (
            <Box>
              <SentimentDissatisfied color="black" />
              No Products Found
            </Box>
          ) : (
            <Grid container marginY="1rem" paddingX="1rem" spacing={2}>
              {Liste.map((product) => {
                // console.log(product);
                // const { id, image, name, category, cost, rating } = product;
                token = window.localStorage.getItem("token");
                return (
                  <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                    <ProductCard
                      product={product}
                      // product={{
                      //   name: name,
                      //   category: category,
                      //   cost: cost,s
                      //   rating: rating,
                      //   image: image,
                      //   _id: id,
                      // }}
                      handleAddToCart={async ()=>{
                        await addToCart(token,detailedItems,Liste,product._id,1,{preventDuplicate:"true"});
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>

        {window.localStorage.getItem("username") && (
          <Grid item xs={12} md={3} bgcolor="#e9fse1">
            <Cart
              products={Liste}
              items={detailedItems}
              handleQuantity={addToCart}
              checkoutBtn
            />
          </Grid>
        )}

        {/* <ProductCard product={"hello"}/> */}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;



// add to cart function is almost completed some method are remaning
