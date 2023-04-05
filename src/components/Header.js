import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState} from "react";

import { Avatar, Button, Stack } from "@mui/material";
// import { Button } from "@mui/material";
import { Box, TextField } from "@mui/material";
import { useHistory, Link } from "react-router-dom";

// import React from "react";ss
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const [token, settoken] = useState("");
  const history = useHistory();
  const [search, setsearch] = useState("");


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("balance");
    window.location.reload();
    // history.push("/");
    // console.log("i was here");
  };

  const handleChange = (e) => {
    setsearch(e.target.value);
  };

  // useEffect(() => {
  //   settoken(window.localStorage.getItem("token"));
  // }, [token]);

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}


      {children}
      {hasHiddenAuthButtons ? (
        <Box>
          {" "}
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => history.push("/")}
          >
            Back to explore
          </Button>
        </Box>
      ) : localStorage.getItem("username") ? (
        <Stack gap={1} direction="row" alignItems="center">

<Box mb={4}>

      </Box>
          <Avatar
            src="avatar.png"
            alt="crio.do"
            className="profile-image"
          />

          <Box className="header-info">
            {localStorage.getItem("username")}
          </Box>

          <Button variant="text" onClick={logout}>logout</Button>
        
        </Stack>
      ) : (
        
        <Box>
          <Button
            className="login-button"
            variant="text"
            onClick={() => {
              history.push("/login");
            }}
          >
            Login
          </Button>
          <Button
            className="register-button"
            variant="contained"
            onClick={() => {
              history.push("/register");
            }}
          >
            Register
          </Button>
        </Box>
      )}

      {/* {window.localStorage.getItem("usename") ? (
        <div>
          <Avatar src="public/avatar.png" />
          {children}
          <Button
            className="explore-button"
            variant="text"
            onClick={logout}
          >
            logout
          </Button>{" "}
        </div>
      ) : (
        <div>
          <Button>
            <Link className="link" to="/login">
              login
            </Link>
          </Button>

          <Button>
            <Link className="link" to="/register">
              Register
            </Link>
          </Button>
        </div>
      )} */}

      {/* this is one div  */}

      {/* <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
        >
          <Link to="">Back to explore</Link>
        </Button> */}
    </Box>
  );
};

export default Header;
