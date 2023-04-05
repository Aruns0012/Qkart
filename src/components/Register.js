import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import { useHistory, Link } from "react-router-dom";

import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setloading] = useState(false);
  const history = useHistory();
  const [formData, setformData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const register = async (formData) => {
    setloading(true);
    try {
      let res = await axios.post(`${config.endpoint}/auth/register`, {
        username: formData.username,
        password: formData.password
      });
      // console.log(res.status);
      setloading(false);
      if (res.status === 201) {
        let message = "success";
        enqueueSnackbar(message, { variant: "success" });
        history.push("/login");
      }
      // console.log("done here");
    } catch (err) {
      setloading(false);
      if (err.res && err.res.status === 400) {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      } else {
        enqueueSnackbar("Username is already taken", { variant: "error" });
      }
    }
  };

  const handleInput = (e) => {
    const [key, value] = [e.target.name, e.target.value];
    setformData({ ...formData, [key]: value });
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
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
    } else if (data.password !== data.confirmPassword) {
      flag = false;
      enqueueSnackbar("Passwords do not match", { variant: "error" });
    }

    if (flag) {
      await register(formData);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={true} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
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
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={handleInput}
          />

{loading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button
              className="button"
              variant="contained"
              onClick={() => validateInput(formData)}
            >
              Register Now
            </Button>
          )}


          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;




