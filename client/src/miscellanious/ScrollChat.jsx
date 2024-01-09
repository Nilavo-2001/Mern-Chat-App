import React, { useContext } from "react";
import { MessageBox, SystemMessage } from "react-chat-elements";
import { chatContext } from "../context/chatProvider";
import ScrollableFeed from "react-scrollable-feed";
import "../styles/chatScroll.css";
//import { Box, Hidden } from "@mui/material";
function ScrollChat({ messages, isTyping }) {
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
                message.sender._id == user._id ? "You" : message.sender.name
              }
              text={message.content}
              avatar={message.sender._id == user._id ? "" : message.sender.pic}
              date={message.createdAt}
            />
          );
        })}
      {isTyping && <SystemMessage text={"user typing ..."} />}
    </ScrollableFeed>
  );
}

export default ScrollChat;
