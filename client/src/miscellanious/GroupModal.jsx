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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import { useEffect } from "react";

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
  useEffect(() => {
    setSearchResult([
      {
        _id: "650c48a6034bfadd6d1ff966",
        name: "Nilavo Bhattacharya",
        email: "iem.nilavoo2020@gmail.com",
        pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        createdAt: "2023-09-21T13:44:06.402Z",
        updatedAt: "2023-09-21T13:44:06.402Z",
        __v: 0,
      },
      {
        _id: "650c48c6034bfadd6d1ff96a",
        name: "Pantu Pas",
        email: "iem.nilavoo200@gmail.com",
        pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        createdAt: "2023-09-21T13:44:38.041Z",
        updatedAt: "2023-09-21T13:44:38.041Z",
        __v: 0,
      },
      {
        _id: "650c48db034bfadd6d1ff96e",
        name: "Rohan Das",
        email: "iem.nilavoo210@gmail.com",
        pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        createdAt: "2023-09-21T13:44:59.620Z",
        updatedAt: "2023-09-21T13:44:59.620Z",
        __v: 0,
      },
    ]);
  }, []);
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
              />
              <TextField
                id="outlined-basic"
                label="Users"
                variant="outlined"
                sx={{ marginBottom: "6px" }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  disableElevation
                  sx={{ margin: "4px 3px 0 0" }}
                  endIcon={<CloseIcon />}
                  color="secondary"
                >
                  Nilavo Bhattacharya
                </Button>
              </Box>
              <Box>
                <List sx={{ marginTop: "12px" }}>
                  {searchResult.map((user, index) => (
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
                        return;
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
              <Button variant="contained" disableElevation>
                create chat
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
