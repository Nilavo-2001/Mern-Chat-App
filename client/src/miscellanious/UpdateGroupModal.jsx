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
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 2,
  zIndex: -1,
};

export default function UpdateGroupModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
              }}
            >
              <Typography variant="h4"> Group Name</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {[1, 2, 3, 4, 5].map((val) => {
                return (
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{ margin: "4px 3px 0 0" }}
                    endIcon={<CloseIcon />}
                    color="secondary"
                  >
                    {`user ${val}`}
                  </Button>
                );
              })}
            </Box>
            <Box
              sx={{
                paddingY: "18px",
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
                />
                <Button
                  variant="contained"
                  disableElevation
                  sx={{
                    height: "2.5rem",
                  }}
                >
                  Update
                </Button>
              </Box>

              <TextField
                id="outlined-basic"
                label="Users"
                variant="outlined"
                sx={{ marginBottom: "6px" }}
              />
            </Box>
            <Box sx={{ marginTop: "10px", alignSelf: "end" }}>
              <Button variant="contained" disableElevation color="error">
                leave group
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
