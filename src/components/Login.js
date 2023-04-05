import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setloading] = useState(false);
  const [formData, setformData] = useState({
    username: "",
    password: "",
  });

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    setloading(true);
    try {
      let res = await axios.post(`${config.endpoint}/auth/login`, {
        username: formData.username,
        password: formData.password
      });
      console.log(res);
      console.log(res.data.balance);
      setloading(false);
      if (res.status === 201) {
        let message = "logged in";
        enqueueSnackbar(message, { variant: "success" });
        persistLogin(res.data.token, res.data.username, res.data.balance);
        history.push("/");
      }
    } catch (err) {
      setloading(false);
      enqueueSnackbar("password is incorrect", { variant: "error" });
      
      // console.log("something happended");
      // console.log(err);
    }
  };




  const handleInput = (e) => {
    const [key, value] = [e.target.name, e.target.value];
    setformData({ ...formData, [key]: value });
  };
  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = async (data) => {
    let flag = true;

    if (data.username === "") {
      flag = false;
      enqueueSnackbar("Username is a required field", { variant: "error" });
    } else if (data.username.replace(/^\s+|\s+$/gm, "").length < 6) {
      flag = false;
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "error",
      });
    }

    if (data.password === "") {
      flag = false;
      enqueueSnackbar("password is a required field", { variant: "error" });
    } else if (data.password.length < 6) {
      flag = false;
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "error",
      });
    }

    if (flag) {
      await login(formData);
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  // const dataa = {username:"zilli", status:true};
  const persistLogin = (token, username, balance) => {
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("username", username);
    window.localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={true}/>
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
        <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={formData.username}
            onChange={handleInput}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={handleInput}
          />

{loading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button
              // className="button"
              variant="contained"
              onClick={() => validateInput(formData)}
            >
              LOGIN TO QKART
            </Button>
          )}


<p className="secondary-action">
            Dont have an account?{" "}
            <Link className="link" to="/register">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
