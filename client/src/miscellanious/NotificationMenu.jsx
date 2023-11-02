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
  const handleClose = (message) => {
    setSelectedChat(message.chat);
    setNotification(notification.filter((msg) => msg._id != message._id));
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
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
            }}
          >
            No Notification to display
          </MenuItem>
        ) : (
          notification.map((message) => {
            return (
              <MenuItem
                onClick={() => {
                  handleClose(message);
                }}
              >
                {message.chat.isGroupChat
                  ? `Message recieved in ${message.chat.chatName}`
                  : `Message recieved from ${getSender(
                      user,
                      message.chat.users
                    )}`}
              </MenuItem>
            );
          })
        )}
      </Menu>
    </div>
  );
}
