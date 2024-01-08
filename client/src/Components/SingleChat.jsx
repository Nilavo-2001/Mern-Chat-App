import React, { useContext, useEffect, useState } from "react";
import { chatContext } from "../context/chatProvider";
import {
  Box,
  Button,
  CircularProgress,
  InputBase,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getSender, getSenderFull } from "../utils/chatLogics";
import UserModal from "../miscellanious/UserModal";
import UpdateGroupModal from "../miscellanious/UpdateGroupModal";
import SendIcon from "@mui/icons-material/Send";
import { error as errorToast } from "../utils/toast";
import ScrollChat from "../miscellanious/ScrollChat";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare, lastTypingTime;
function SingleChat() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    fetchAgain,
    setFetchAgain,
  } = useContext(chatContext);

  useEffect(() => {
    console.log("chat box effect");
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("start typing", (userId) => {
      if (userId == user._id) return;
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);

  const isSmall = useMediaQuery("(max-width:500px)");
  const isMedium = useMediaQuery("(max-width:900px)");
  const fetchAllMessages = async () => {
    if (!selectedChat) return;
    try {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${user.token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        requestOptions
      );
      const data = await res.json();
      setMessages(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      errorToast("Failed to Load Messages");
    }
  };

  const sendMessage = async () => {
    if (!newMessage) {
      errorToast("Please Enter a Message to Send");
      return;
    }
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${user.token}`);

      var raw = JSON.stringify({
        content: newMessage,
        chatId: selectedChat._id,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      setNewMessage("");
      const res = await fetch(
        "http://localhost:5000/api/message",
        requestOptions
      );
      const data = await res.json();
      console.log(data);
      setMessages([...messages, data]);
      socket.emit("new message", data);
    } catch (error) {
      errorToast("Failed to Send Message");
    }
  };
  const typingHandler = async (e) => {
    setNewMessage(e.target.value);
    socket.emit("start typing", { userId: user._id, room: selectedChat._id });
    const len = 3000;
    lastTypingTime = new Date().getTime();
    setTimeout(() => {
      let curTime = new Date().getTime();
      if (curTime - lastTypingTime >= len)
        socket.emit("stop typing", selectedChat._id);
    }, len);
  };

  const updateMessageHandler = async (message) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${user.token}`);

      var raw = JSON.stringify({
        messageId: message._id,
      });

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      let res = await fetch(
        "http://localhost:5000/api/message/update",
        requestOptions
      );
      let data = await res.json();
      console.log("update", data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      errorToast("Failed to update message view");
    }
  };

  const trimName = (name) => {
    let maxChar = 15;
    if (isSmall) {
      maxChar = 12;
    } else if (isMedium) {
      maxChar = 30;
    } else {
      maxChar = 50;
    }
    if (name.length > maxChar) {
      return name.substring(0, 8) + "..";
    }
    return name;
  };
  useEffect(() => {
    fetchAllMessages();

    if (selectedChat) socket.emit("join chat", selectedChat._id);
    return () => {
      if (selectedChat) {
        socket.emit("stop typing", selectedChat._id);
        socket.emit("leave chat", selectedChat._id);
        setIsTyping(false);
      }
    };
  }, [selectedChat]);

  useEffect(() => {
    const listener = (message) => {
      console.log("received a new message");
      if (!selectedChat || selectedChat._id != message.chat._id) {
        setFetchAgain(!fetchAgain);
      } else {
        console.log("messages ", messages);
        setMessages([...messages, message]);
        updateMessageHandler(message);
      }
    };
    socket.on("received message", listener);
    return () => {
      socket.off("received message", listener);
    };
  });
  return (
    <>
      {selectedChat ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              height: "8%",
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
                ? trimName(selectedChat.chatName)
                : trimName(getSender(user, selectedChat.users))}
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
              height: "90%",
              boxSizing: "border-box",
              borderRadius: "15px",
              overflowY: "hidden",
            }}
          >
            <Box
              sx={{
                height: "85%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                paddingY: "4%",
                paddingX: "1%",
                justifyContent: loading ? "center" : "normal",
              }}
            >
              {loading ? (
                <CircularProgress
                  sx={{
                    alignSelf: "center",
                  }}
                  size={200}
                />
              ) : (
                <ScrollChat messages={messages} isTyping={isTyping} />
              )}
            </Box>
            <Box
              sx={{
                height: "15%",
                boxSizing: "border-box",
                padding: "8px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <InputBase
                placeholder="What's on your mind..."
                value={newMessage}
                onChange={typingHandler}
                sx={{
                  width: "90%",
                  backgroundColor: "#C0C0C0",
                  borderRadius: "0.8rem",
                  padding: "1rem 2rem",
                }}
              />
              <Button
                sx={{
                  width: "9%",
                }}
                variant="contained"
                onClick={sendMessage}
              >
                <SendIcon fontSize="large" />
              </Button>
            </Box>
          </Box>
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
