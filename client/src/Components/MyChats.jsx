import React, { useContext, useEffect, useState } from "react";
import { chatContext } from "../context/chatProvider";
import { error as errorToast } from "../utils/toast";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
} from "@mui/material";
import { getSender } from "../utils/chatLogics";
import GroupModal from "../miscellanious/GroupModal";

function MyChats() {
  const [loggedUser, setLoggedUser] = useState();
  const [chatLoading, setChatLoading] = useState(false);
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    fetchAgain,
    setFetchAgain,
  } = useContext(chatContext);

  const fetchChats = async () => {
    try {
      // console.log("user token from fetchChats", user.token);
      setChatLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${user.token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      let reponse = await fetch(
        "http://localhost:5000/api/chat",
        requestOptions
      );
      let data = await reponse.json();
      //console.log(data);
      setChatLoading(false);
      setChats(data);
    } catch (error) {
      console.log(error);
      errorToast("Failed to fetch chats");
    }
  };

  useEffect(() => {
    //setLoggedUser(decObj(JSON.parse(localStorage.getItem("userInfo"))));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      sx={{
        display: { lg: "flex", xs: selectedChat ? "none" : "flex" }, // to be improved
        flexDirection: "column",
        bgcolor: "white",
        height: "95%",
        padding: "8px",
        width: { xs: "100%", lg: "40%" },
        height: "85vh",
        borderRadius: "10px",
        borderWidth: "1px",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          paddingX: "20px",
          paddingY: "10px",
          fontFamily: "Work Sans",
          fontSize: { xs: "28px", md: "30px" },
          display: "flex",
          width: "100%",
          height: "10%",
          boxSizing: "border-box",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <span>My Chats</span>
        <GroupModal />
      </Box>

      <Box
        sx={{
          padding: "10px",
          bgcolor: "#F8F8F8",
          borderRadius: "10px",
          width: "100%",
          boxSizing: "border-box",
          height: "90%",
          overflowY: "auto",
        }}
      >
        <List>
          {chatLoading
            ? Array.from({ length: 5 }, (_, index) => (
                <ListItem
                  sx={{
                    padding: "9px",
                    borderRadius: "5px",
                    bgcolor: "#E8E8E8",
                    marginBottom: "5px",
                  }}
                  key={index}
                >
                  <ListItemText>
                    <Skeleton width={150} />
                  </ListItemText>
                </ListItem>
              ))
            : chats.map((chat) => {
                return (
                  <ListItem
                    sx={{
                      padding: "9px",
                      borderRadius: "5px",
                      bgcolor: "#E8E8E8",
                      ":hover": { bgcolor: "grey" },
                      marginBottom: "5px",
                      cursor: "pointer",
                    }}
                    key={chat._id}
                    onClick={() => {
                      setSelectedChat(chat);
                    }}
                  >
                    <ListItemText
                      primary={
                        chat.isGroupChat
                          ? chat.chatName
                          : getSender(user, chat.users)
                      }
                    />
                  </ListItem>
                );
              })}
        </List>
      </Box>
    </Box>
  );
}

export default MyChats;
