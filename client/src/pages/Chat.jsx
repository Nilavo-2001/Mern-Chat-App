import React from "react";
import NavBar from "../Components/NavBar";
import { Box } from "@mui/material";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import { sucess } from "../utils/toast";

function Chat() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <NavBar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <MyChats />
        <ChatBox />
      </Box>
    </Box>
  );
}

export default Chat;
