import React, { useContext } from "react";
import { chatContext } from "../context/chatProvider";
import { Box } from "@mui/material";
import SingleChat from "./SingleChat";

function ChatBox() {
  const { selectedChat } = useContext(chatContext);
  return (
    <Box
      className="child2"
      sx={{
        display: { lg: "flex", xs: selectedChat ? "flex" : "none" },
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "white",
        padding: "0 12px 12px 12px",
        width: { xs: "100%", lg: "56%" },
        height: "100%",
        borderRadius: "10px",
        borderWidth: "1px",
        boxSizing: "border-box",
      }}
    >
      <SingleChat />
    </Box>
  );
}

export default ChatBox;
