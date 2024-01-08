import { Box, Button, Tooltip, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import ProfileMenu from "../miscellanious/ProfileMenu";
import NotificationMenu from "../miscellanious/NotificationMenu";
import ChatDrawer from "./ChatDrawer";

function NavBar() {
  return (
    <Box
      sx={{
        bgcolor: "white",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <ChatDrawer />

      <Typography
        variant="h4"
        fontFamily={"Work Sans"}
        sx={{
          fontSize: { xs: "1.8rem", sm: "2.125rem" },
        }}
      >
        Chat-App
      </Typography>
      <Box sx={{ display: "flex" }}>
        <NotificationMenu />
        <ProfileMenu />
      </Box>
    </Box>
  );
}

export default NavBar;
