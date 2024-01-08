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
import { getSender, getSenderFull } from "../utils/chatLogics";
import GroupModal from "../miscellanious/GroupModal";
import { ChatItem } from "react-chat-elements";
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
    notification,
    setNotification,
  } = useContext(chatContext);

  const fetchChats = async (toLoad) => {
    try {
      // console.log("user token from fetchChats", user.token);
      if (toLoad) setChatLoading(true);
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
      console.log("chats", data);
      if (toLoad) setChatLoading(false);
      setChats(data);
      setNotification(data.filter((chat) => chat.unread != 0));
    } catch (error) {
      console.log(error);
      errorToast("Failed to fetch chats");
    }
  };

  useEffect(() => {
    fetchChats(true);
  }, []);

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
        padding: "8px",
        width: { xs: "100%", lg: "40%" },
        height: { xs: "100%", md: "85vh" },
        borderRadius: "10px",
        borderWidth: "1px",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          paddingX: { xs: "10px", sm: "20px" },
          paddingY: { xs: "5px", sm: "10px" },
          fontFamily: "Work Sans",
          fontSize: { xs: "28px", md: "30px" },
          display: "flex",
          width: "100%",
          height: { sm: "7%", md: "10%" },
          boxSizing: "border-box",
          justifyContent: "space-between",
          alignItems: { xs: "flex-end", sm: "flex-start" },
        }}
      >
        <Box
          sx={{
            fontSize: { xs: "1.6rem", sm: "2rem" },
          }}
        >
          My Chats
        </Box>
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
                  <ChatItem
                    avatar={
                      chat.isGroupChat
                        ? null
                        : getSenderFull(user, chat.users).pic
                    }
                    title={
                      chat.isGroupChat
                        ? chat.chatName
                        : getSender(user, chat.users)
                    }
                    subtitle={
                      chat.latestMessage ? chat.latestMessage.content : ""
                    }
                    date={
                      chat.latestMessage ? chat.latestMessage.createdAt : ""
                    }
                    unread={chat.unread}
                    key={chat._id}
                    onClick={() => {
                      setSelectedChat(chat);
                    }}
                  />
                );
              })}
        </List>
      </Box>
    </Box>
  );
}

export default MyChats;
