import { Box, Button, Input } from "@mui/material";
import React, { useContext, useState } from "react";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LoadingButton from "@mui/lab/LoadingButton";
import { ToastContainer } from "react-toastify";
import { sucess, warning, error as errorToast } from "../utils/toast";
import { encObj } from "../utils/encrypt";
import { chatContext } from "../context/chatProvider";
//import { ChatState } from "../context/chatProvider";
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
  const navigate = useNavigate();
  const { user, setUser } = useContext(chatContext);

  const uploadDp = (pics) => {
    console.log(pics);
    if (pics && (pics.type == "image/jpeg" || pics.type == "image/jpeg")) {
      setPic(pics);
      sucess("Image Uploaded Sucessfully");
    } else {
      setPic(undefined);
      warning("Upload Image Only");
    }
  };
  const uploadDpCloud = async () => {
    if (pic) {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dmkgepiyt");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dmkgepiyt/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const responseData = await response.json();
      const url = responseData.url.toString();
      console.log(url);
      return url;
    }
  };
  const submitHandler = async () => {
    try {
      setLoading(true);
      if (!name || !email || !password || !confirmPassword) {
        warning("Fill all the fields");
        setLoading(false);
        return;
      }
      if (password != confirmPassword) {
        warning("Password and Confirm Password does not match");
        setLoading(false);
        return;
      }
      //to upload image and generate link;
      const picLink = await uploadDpCloud();
      //done uploading
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      if (picLink) {
        var raw = JSON.stringify({
          name,
          email,
          password,
          confirmpassword: confirmPassword,
          pic: picLink,
        });
      } else {
        var raw = JSON.stringify({
          name,
          email,
          password,
          confirmpassword: confirmPassword,
        });
      }

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch("/api/user/auth/register", requestOptions);
      if (response.status == 200) {
        setLoading(false);
        sucess("Registration Sucessful");
      }
      const userData = await response.json();
      console.log("signup ", userData);
      localStorage.setItem("userInfo", JSON.stringify(encObj(userData)));
      setUser(userData);
      navigate("/chats");
    } catch (error) {
      errorToast("Failed to Register");
      setLoading(false);
    }
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

        <LoadingButton
          loading={loading}
          variant="contained"
          sx={{ backgroundColor: "#3182ce" }}
          onClick={submitHandler}
        >
          Signup
        </LoadingButton>
      </Box>
    </>
  );
}

export default Signup;
