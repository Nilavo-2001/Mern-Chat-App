import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Avatar, Stack } from "@mui/material";
import { useContext } from "react";
import { chatContext } from "../context/chatProvider";
//import { ChatState } from "../context/chatProvider";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "300px",
  alignItems: "center",
};

export default function UserModal({ name }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { user } = useContext(chatContext);
  return (
    <div>
      <Typography onClick={handleOpen} color="inherit">
        {name}
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h3">{user.name}</Typography>
          <Avatar
            alt="Profile Picture"
            sx={{ width: "150px", height: "150px" }}
            src={user.pic}
          />
          <Typography variant="h5">{user.email}</Typography>
        </Box>
      </Modal>
    </div>
  );
}
