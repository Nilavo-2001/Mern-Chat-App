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
import {
  getSender,
  getSenderFull,
  generateRandomString,
} from "../utils/chatLogics";
import UserModal from "../miscellanious/UserModal";
import UpdateGroupModal from "../miscellanious/UpdateGroupModal";
import SendIcon from "@mui/icons-material/Send";
import { error, error as errorToast, sucess, warning } from "../utils/toast";
import ScrollChat from "../miscellanious/ScrollChat";
import io from "socket.io-client";
import Switch from "@mui/material/Switch";
const ENDPOINT = "https://anonychat-gxrf.onrender.com";
var socket, selectedChatCompare, lastTypingTime;
function SingleChat() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [anonySelf, setAnonySelf] = useState(false);
  const [anony, setAnony] = useState(false);
  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    fetchAgain,
    setFetchAgain,
    setGlobalLoading,
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
  const fetchAllMessages = async (isAnony) => {
    // console.log("messages fetched");
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
        `/api/message/${selectedChat._id}`,
        requestOptions
      );
      const data = await res.json();
      setMessages(data);
      if (!isAnony) setFetchAgain(!fetchAgain);
      setLoading(false);
      if (!isAnony) socket.emit("join chat", selectedChat._id);
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
      let data = {},
        res;
      if (!anonySelf) {
        res = await fetch("/api/message", requestOptions);
        data = await res.json();
      } else {
        data = {
          sender: user,
          content: newMessage,
          chat: selectedChat,
          seen: user._id,
        };
      }
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

      let res = await fetch("/api/message/update", requestOptions);
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
      if (selectedChat.isGroupChat) maxChar = 12;
      else maxChar = 5;
    } else if (isMedium) {
      maxChar = 30;
    } else {
      maxChar = 50;
    }
    if (name.length > maxChar) {
      if (isSmall && !selectedChat.isGroupChat)
        return name.substring(0, 3) + "..";
      else return name.substring(0, 8) + "..";
    }
    return name;
  };
  useEffect(() => {
    setAnony(false);
    setAnonySelf(false);
    fetchAllMessages();
    if (selectedChat) {
      console.log("called");
      socket.emit("join chat", selectedChat._id);
      checkAnony();
    }
    return () => {
      if (selectedChat) {
        socket.emit("stop typing", selectedChat._id);
        socket.emit("leave chat", selectedChat._id);
        setIsTyping(false);
      }
    };
  }, [selectedChat]);

  useEffect(() => {
    const recieveMessage = (message) => {
      console.log("received a new message");
      if ((!selectedChat || selectedChat._id != message.chat._id) && !anony) {
        setFetchAgain(!fetchAgain);
      } else {
        console.log("messages ", messages);
        setMessages([...messages, message]);
        if (!anony) updateMessageHandler(message); //this is how message seen is updated
      }
    };
    const anonyActivated = (userId) => {
      if (user._id == userId) {
        return;
      } //this to check that the current user is not the user who has turned on anony mode
      console.log("anony chat activated event recieved");
      warning(`The user you are chatting with has turned on anonymous mode`);
      setAnony(true);
    };
    const anonyStopped = (userId) => {
      if (user._id == userId) {
        return;
      }
      console.log("anony chat stopped event recieved");
      warning(`The user you are chatting with has turned off anonymous mode`);
      setAnony(false);
      fetchAllMessages(true);
    };
    socket.on("received message", recieveMessage);
    socket.on("anony activated", anonyActivated);
    socket.on("anony stopped", anonyStopped);
    return () => {
      socket.off("received message", recieveMessage);
      socket.off("anony activated", anonyActivated);
      socket.off("anony stopped", anonyStopped);
    };
  });

  const toggleAnonySelf = async () => {
    console.log("toggle anony called");
    setAnonySelf(!anonySelf);
    console.log("activate anony", anonySelf);
    if (!anonySelf) {
      setGlobalLoading(true);
      const status = await activateAnony();
      if (status == 200) {
        setGlobalLoading(false);
        sucess("You have turned on anonymous mode");
        socket.emit("activate anony", {
          userId: user._id,
          room: selectedChat._id,
        });
      } else {
        setAnonySelf(!anonySelf);
      }
    }
    if (anonySelf) {
      setGlobalLoading(true);
      const status = await stopAnony();
      if (status == 200) {
        setGlobalLoading(false);
        sucess("You have turned off anonymous mode");
        socket.emit("stop anony", { userId: user._id, room: selectedChat._id });
      } else {
        setAnonySelf(!anonySelf);
      }
    }
  };

  const activateAnony = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${user.token}`);

      const raw = JSON.stringify({
        chatId: `${selectedChat._id}`,
        userId: `${user._id}`,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const res = await fetch("/api/chat/anony/add", requestOptions);
      return res.status;
    } catch (err) {
      error("failed to turn on anony");
    }
  }; //this is implemented to add the user in anony array of chat
  const stopAnony = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${user.token}`);

      const raw = JSON.stringify({
        chatId: `${selectedChat._id}`,
        userId: `${user._id}`,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const res = await fetch("/api/chat/anony/remove", requestOptions);
      return res.status;
    } catch (err) {
      error("failed to turn off anony");
    }
  }; //this is implemented to remove the user in anony array of chat
  const checkAnony = async () => {
    console.log("called check");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${user.token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `/api/chat/anony/check/${selectedChat._id}`,
      requestOptions
    );
    const data = await res.json();
    console.log("data ", data);
    if (data.anony.length == 2) {
      //when both the users have turned on anony mode
      setAnony(true);
      setAnonySelf(true);
    } else if (data.anony.length == 1) {
      //when only one user has turned on anony mode
      const userId = data.anony[0];
      console.log(userId, user._id);
      if (userId == user._id) {
        setAnonySelf(true);
      } else {
        setAnony(true);
      }
    }
  };

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
                : anony
                ? generateRandomString()
                : trimName(getSender(user, selectedChat.users))}
            </Typography>
            {selectedChat.isGroupChat ? (
              ""
            ) : (
              <Switch checked={anonySelf} onClick={toggleAnonySelf} />
            )}
            {selectedChat.isGroupChat ? (
              <UpdateGroupModal />
            ) : (
              <UserModal
                user={anony ? {} : getSenderFull(user, selectedChat.users)}
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
                <ScrollChat
                  messages={messages}
                  isTyping={isTyping}
                  anony={anony}
                />
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
