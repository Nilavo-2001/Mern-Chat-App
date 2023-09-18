import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { TextField } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { sucess, warning, error as errorToast } from "../utils/toast";
import LoadingButton from "@mui/lab/LoadingButton";
import { encObj } from "../utils/encrypt";
function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const loginUser = async (Email = email, Password = password) => {
    try {
      setLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        email: Email,
        password: Password,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:5000/api/user/login",
        requestOptions
      );
      const userData = await response.json();
      if (response.status == 200) {
        setLoading(false);
        sucess("Login Sucessful");
      } else {
        warning(userData);
      }
      console.log(userData);
      localStorage.setItem("userInfo", JSON.stringify(encObj(userData)));
    } catch (error) {
      errorToast("Failed to Login");
      setLoading(false);
    }
  };

  const defaultUserLogin = async () => {
    await loginUser("test@test.com", "test123");
  };

  const submitHandler = async () => {
    if (!email || !password) {
      warning("Fill all the fields");
      setLoading(false);
      return;
    }
    await loginUser();
  };
  return (
    <>
      {console.log(email, password)}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "260px",
          justifyContent: "space-evenly",
        }}
      >
        <TextField
          required
          id="outlined-required"
          label="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextField
          required
          id="outlined-required"
          type="password"
          label="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <LoadingButton
          loading={loading}
          variant="contained"
          onClick={submitHandler}
          sx={{ backgroundColor: "#3182ce" }}
        >
          Login
        </LoadingButton>

        <LoadingButton
          loading={loading}
          variant="contained"
          sx={{ backgroundColor: "#e53e3e !important" }}
          onClick={() => {
            defaultUserLogin();
          }}
        >
          Login as guest user
        </LoadingButton>
      </Box>
      <ToastContainer />
    </>
  );
}

export default Login;
