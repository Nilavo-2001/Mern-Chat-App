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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 2,
  zIndex: -1,
};

export default function GroupModal() {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = useContext(chatContext);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
  const addUser = (user) => {
    if (selectedUsers.find((curUser) => curUser._id == user._id)) {
      errorToast(`${user.name} already added`);
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };
  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((curUser) => curUser._id != userId));
  };
  const handleSubmit = async () => {
    if (groupChatName == "" || selectedUsers.length == 0) {
      errorToast("Please fill all the fields");
      return;
    }
    if (selectedUsers.length < 2) {
      errorToast("Atleast 3 users required");
      return;
    }
    try {
      setLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${user.token}`);

      var raw = JSON.stringify({
        users: selectedUsers.map((user) => user._id),
        name: groupChatName,
      });
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      //console.log("fetch called");
      const response = await fetch(
        `http://localhost:5000/api/chat/group`,
        requestOptions
      );
      const result = await response.json();
      setLoading(false);
      console.log("result ", result);
      setChats([result, ...chats]);
      setOpen(false);
      sucessToast("Sucessfully created group");
    } catch (error) {
      setLoading(false);
      console.log(error);
      errorToast("Failed to create group");
    }
  };
  console.log(selectedUsers);
  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="contained"
        disableElevation
        endIcon={<AddIcon />}
      >
        Create Group Chat
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
                alignSelf: "center",
              }}
            >
              <Typography variant="h4"> Create Group Chat</Typography>
            </Box>
            <Box
              sx={{
                paddingY: "18px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Group Name"
                variant="outlined"
                sx={{ marginBottom: "12px" }}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
              <TextField
                id="outlined-basic"
                label="Users"
                variant="outlined"
                sx={{ marginBottom: "6px" }}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {selectedUsers.map((user, index) => {
                  return (
                    <Button
                      variant="contained"
                      disableElevation
                      sx={{ margin: "4px 3px 0 0" }}
                      endIcon={<CloseIcon />}
                      color="secondary"
                      key={index}
                      onClick={() => {
                        removeUser(user._id);
                      }}
                    >
                      {user.name}
                    </Button>
                  );
                })}
              </Box>
              <Box>
                <List sx={{ marginTop: "12px" }}>
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
                        addUser(user);
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
            </Box>
            <Box sx={{ marginTop: "10px", alignSelf: "end" }}>
              {loading ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disableElevation
                >
                  create chat
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
