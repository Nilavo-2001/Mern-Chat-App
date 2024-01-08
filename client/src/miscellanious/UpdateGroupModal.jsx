import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import { chatContext } from "../context/chatProvider";
import {
  Avatar,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import { error as errorToast, sucess as sucessToast } from "../utils/toast";
import Visibility from "@mui/icons-material/Visibility";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 300, sm: 400 },
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 2,
  zIndex: -1,
};

export default function UpdateGroupModal() {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { selectedChat, setSelectedChat, user, setFetchAgain, fetchAgain } =
    useContext(chatContext);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRename = async () => {
    if (!groupChatName) {
      errorToast("Please Provide a Group Name to update");
      return;
    }
    try {
      setRenameLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${user.token}`);

      var raw = JSON.stringify({
        chatId: selectedChat._id,
        name: groupChatName,
      });

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const res = await fetch(
        "http://localhost:5000/api/chat/rename",
        requestOptions
      );
      const data = await res.json();
      console.log("rename chat updated data ", data);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      setRenameLoading(false);
      errorToast("Failed to Update Chat Name");
    }
  };
  const handleAddUser = async (curUser) => {
    if (selectedChat.users.find((u) => u._id == curUser._id)) {
      errorToast(`${curUser.name} already added`);
      return;
    }

    if (selectedChat.groupAdmin._id != user._id) {
      errorToast("You need to be admin to add/remove someone");
      return;
    }

    try {
      setRenameLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${user.token}`);

      var raw = JSON.stringify({
        chatId: selectedChat._id,
        userId: curUser._id,
      });

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const res = await fetch(
        "http://localhost:5000/api/chat/groupadd",
        requestOptions
      );
      const data = await res.json();
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      errorToast("Failed to Add User");
      setRenameLoading(false);
    }
  };
  const handleRemoveUser = async (curUser) => {
    if (!selectedChat.users.find((u) => u._id == curUser._id)) {
      errorToast(`${curUser.name} not present`);
      return;
    }

    if (selectedChat.groupAdmin._id != user._id) {
      errorToast("You need to be admin to add/remove someone");
      return;
    }

    try {
      setRenameLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${user.token}`);

      var raw = JSON.stringify({
        chatId: selectedChat._id,
        userId: curUser._id,
      });

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const res = await fetch(
        "http://localhost:5000/api/chat/groupremove",
        requestOptions
      );
      const data = await res.json();
      curUser._id == user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      errorToast("Failed to Remove User");
      setRenameLoading(false);
    }
  };
  const handleSearch = async (searchQuery) => {
    // Clear previous search results
    setSearchResult([]);
    if (searchQuery == "") {
      return;
    }
    try {
      setSearchResult([{ name: "loading..." }]);
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${user.token}`);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
      };

      const response = await fetch(
        `http://localhost:5000/api/user/search?search=${searchQuery}`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      if (result.length != 0) {
        setSearchResult(result);
      } else {
        setSearchResult([{ name: "No User Found" }]);
      }
      setLoading(false);
    } catch (error) {
      errorToast("Error Occurred");
      setLoading(false);
    }
  };
  const handleLeaveGrp = async () => {
    if (!selectedChat.users.find((u) => u._id == user._id)) {
      errorToast(`You are not present`);
      return;
    }

    try {
      setRenameLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${user.token}`);

      var raw = JSON.stringify({
        chatId: selectedChat._id,
        userId: user._id,
      });

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const res = await fetch(
        "http://localhost:5000/api/chat/groupremove",
        requestOptions
      );
      const data = await res.json();
      setSelectedChat();
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      errorToast("Failed to Remove User");
      setRenameLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="outlined" disableElevation>
        <Visibility />
      </Button>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                alignSelf: "end",
                cursor: "pointer",
              }}
              onClick={handleClose}
            >
              <CloseIcon />
            </Box>
            <Box
              sx={{
                marginBottom: "12px",
                alignSelf: "center",
              }}
            >
              <Typography variant="h4">{selectedChat.chatName}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {selectedChat.users.map((user) => {
                return (
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{ margin: "4px 3px 0 0" }}
                    endIcon={<CloseIcon />}
                    color="secondary"
                    onClick={() => {
                      handleRemoveUser(user);
                    }}
                  >
                    {user.name}
                  </Button>
                );
              })}
            </Box>
            <Box
              sx={{
                paddingTop: "18px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="Group Name"
                  variant="outlined"
                  sx={{
                    width: "75%",
                  }}
                  onChange={(e) => {
                    setGroupChatName(e.target.value);
                  }}
                />
                {renameLoading ? (
                  <CircularProgress />
                ) : (
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      height: "2.5rem",
                    }}
                    onClick={() => {
                      handleRename();
                    }}
                  >
                    Update
                  </Button>
                )}
              </Box>

              <TextField
                id="outlined-basic"
                label="Users"
                variant="outlined"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </Box>
            <Box>
              <List>
                {searchResult.slice(0, 4).map((user, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      cursor: "pointer",
                      bgcolor: "lightgrey",
                      ":hover": { bgcolor: "grey" },
                      marginBottom: "5px",
                      borderRadius: "10px",
                    }}
                    onClick={() => {
                      handleAddUser(user);
                    }}
                  >
                    {user.pic && (
                      <ListItemAvatar>
                        <Avatar src={user.pic} />
                      </ListItemAvatar>
                    )}
                    <ListItemText primary={user.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box sx={{ marginTop: "10px", alignSelf: "end" }}>
              <Button
                variant="contained"
                disableElevation
                color="error"
                onClick={() => {
                  handleLeaveGrp();
                }}
              >
                leave group
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
