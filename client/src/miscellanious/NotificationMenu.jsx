import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { chatContext } from "../context/chatProvider";
import { useState } from "react";
import { useContext } from "react";
import { getSender } from "../utils/chatLogics";
import { Badge } from "@mui/material";
export default function NotificationMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    useContext(chatContext);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChatRedirect = (chat) => {
    setSelectedChat(chat);
    setNotification(notification.filter((cht) => cht._id != chat._id));
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
      >
        <Badge badgeContent={notification.length} color="primary">
          <NotificationsIcon />
        </Badge>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {notification.length == 0 ? (
          <MenuItem onClick={handleClose}>No Notification to display</MenuItem>
        ) : (
          notification.map((chat) => {
            return (
              <MenuItem
                onClick={() => {
                  handleChatRedirect(chat);
                }}
              >
                {chat.isGroupChat
                  ? `${chat.unread} new ${
                      chat.unread > 1 ? "mesaages" : "message"
                    } recieved in ${chat.chatName}`
                  : `${chat.unread} new ${
                      chat.unread > 1 ? "mesaages" : "message"
                    } recieved from ${getSender(user, chat.users)}`}
              </MenuItem>
            );
          })
        )}
      </Menu>
    </div>
  );
}
