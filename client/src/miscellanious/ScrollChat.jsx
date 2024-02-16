import React, { useContext } from "react";
import { MessageBox, SystemMessage } from "react-chat-elements";
import { chatContext } from "../context/chatProvider";
import ScrollableFeed from "react-scrollable-feed";
import "../styles/chatScroll.css";
import { generateRandomString } from "../utils/chatLogics";
//import { Box, Hidden } from "@mui/material";
function ScrollChat({ messages, isTyping, anony }) {
  const { user } = useContext(chatContext);
  return (
    <ScrollableFeed className="scroll-chat">
      {messages &&
        messages.map((message, index) => {
          return (
            <MessageBox
              position={message.sender._id === user._id ? "right" : "left"}
              key={index}
              type={"text"}
              title={
                message.sender._id == user._id
                  ? "You"
                  : anony
                  ? generateRandomString()
                  : message.sender.name
              }
              text={message.content}
              avatar={
                message.sender._id == user._id || anony
                  ? ""
                  : message.sender.pic
              }
              date={message.createdAt}
            />
          );
        })}
      {isTyping && <SystemMessage text={"user typing ..."} />}
    </ScrollableFeed>
  );
}

export default ScrollChat;
