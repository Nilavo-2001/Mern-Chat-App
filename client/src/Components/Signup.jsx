import { Box, Button, Input } from "@mui/material";
import React, { useState } from "react";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
function Signup() {
  const [pic, setPic] = useState(undefined);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setconfirmPassword] = useState();
  const [loading, setLoading] = useState(false);

  const uploadDp = (pics) => {
    console.log(pics);
    if (pics && (pics.type == "image/jpeg" || pics.type == "image/jpeg")) {
      setPic(pics);
      toast.success("Image Uploaded Sucessfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      setPic(undefined);
      toast.warn("Upload Image Only", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const submitHandler = async () => {
    //to be completed
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "380px",
          justifyContent: "space-evenly",
          overflow: "auto",
        }}
      >
        <TextField
          required
          id="outlined-required"
          label="Name"
          defaultValue={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
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
        <TextField
          required
          id="outlined-required"
          type="password"
          label="Confirm Password"
          defaultValue={confirmPassword}
          onChange={(e) => {
            setconfirmPassword(e.target.value);
          }}
        />
        <Button
          component="label"
          variant="contained"
          sx={{ backgroundColor: "green !important" }}
          startIcon={<CloudUploadIcon />}
        >
          {pic && pic.name ? pic.name : "Upload Profile Picture"}
          <VisuallyHiddenInput
            type="file"
            onChange={(e) => {
              uploadDp(e.target.files[0]);
            }}
          />
        </Button>

        <Button
          variant="contained"
          sx={{ backgroundColor: "#3182ce" }}
          onClick={submitHandler}
        >
          Signup
        </Button>
      </Box>
      <ToastContainer />
    </>
  );
}

export default Signup;
