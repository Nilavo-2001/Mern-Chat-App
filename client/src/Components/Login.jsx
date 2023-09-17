import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { TextField } from "@mui/material";
function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const submitHandler = () => {
    console.log(email, password);
  };
  return (
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
        defaultValue={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <TextField
        required
        id="outlined-required"
        type="password"
        label="Password"
        defaultValue={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <Button
        variant="contained"
        onClick={submitHandler}
        sx={{ backgroundColor: "#3182ce" }}
      >
        Login
      </Button>

      <Button
        variant="contained"
        sx={{ backgroundColor: "#e53e3e !important" }}
      >
        Get user credential
      </Button>
    </Box>
  );
}

export default Login;
