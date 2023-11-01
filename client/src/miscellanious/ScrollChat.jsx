import React, { useContext } from "react";
import { MessageBox } from "react-chat-elements";
import { chatContext } from "../context/chatProvider";
import ScrollableFeed from "react-scrollable-feed";
import "../styles/chatScroll.css";
function ScrollChat({ messages }) {
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
            />
          );
        })}
    </ScrollableFeed>
  );
}

export default ScrollChat;
