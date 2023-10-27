import React, { useContext } from "react";
import { chatContext } from "../context/chatProvider";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getSender, getSenderFull } from "../utils/chatLogics";
import UserModal from "../miscellanious/UserModal";
import UpdateGroupModal from "../miscellanious/UpdateGroupModal";

function SingleChat() {
  const { user, selectedChat, setSelectedChat } = useContext(chatContext);
  return (
    <>
      {selectedChat ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              height: "10%",
              boxSizing: "border-box",
              alignItems: "flex-end",
            }}
          >
            <Button
              sx={{ display: { xs: "flex", lg: "none" } }}
              variant="outlined"
              onClick={() => {
                setSelectedChat(null);
              }}
            >
              <ArrowBackIcon />
            </Button>
            <Typography variant="h4" fontFamily={"Work Sans"}>
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : getSender(user, selectedChat.users)}
            </Typography>

            {selectedChat.isGroupChat ? (
              <UpdateGroupModal />
            ) : (
              <UserModal
                user={getSenderFull(user, selectedChat.users)}
                chatProfile={true}
              />
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: "#E8E8E8",
              width: "100%",
              height: "88%",
              boxSizing: "border-box",
              borderRadius: "15px",
              overflowY: "hidden",
            }}
          ></Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h3" fontFamily={"Work Sans"}>
            Click on a chat to start chatting...
          </Typography>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
