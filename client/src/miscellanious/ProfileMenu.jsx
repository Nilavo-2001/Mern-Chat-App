import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Avatar } from "@mui/material";
import UserModal from "./UserModal";
import { useContext } from "react";
import { chatContext } from "../context/chatProvider";
import { sucess } from "../utils/toast";

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { user, setUser } = useContext(chatContext);

  const logout = () => {
    setUser(null);
    sucess("Logged Out Sucessfully");
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Avatar
          sx={{ height: "1.3em", width: "1.3em" }}
          alt={user.name}
          src={user.pic}
        />
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
        <MenuItem>
          <UserModal user={user} name={"My Profile"} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            logout();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
