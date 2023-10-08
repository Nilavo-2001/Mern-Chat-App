import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Tooltip, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function ChatDrawer() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleSearch = () => {
    // Implement your search logic here and update searchResults accordingly
    // For this example, we'll use dummy search results with avatars.
    const dummyResults = [
      { name: "User 1", avatar: "U1" },
      { name: "User 2", avatar: "U2" },
      { name: "User 3", avatar: "U3" },
      { name: "User 4", avatar: "U4" },
      { name: "John Doe", avatar: "JD" },
      { name: "Jane Smith", avatar: "JS" },
    ];

    setSearchResults(dummyResults);
  };

  return (
    <div>
      <Tooltip arrow title="Search Users to Chat">
        <Button
          sx={{ ":hover": { bgcolor: "#F0F0F0" }, p: "10px" }}
          variant="text"
          startIcon={<SearchIcon />}
          color="inherit"
          onClick={toggleDrawer}
        >
          <Typography sx={{ display: { xs: "none", sm: "block" } }}>
            Search User
          </Typography>
        </Button>
      </Tooltip>

      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <div style={{ width: 300, padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              fullWidth
              label="Search User"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              style={{ marginLeft: "8px" }}
            >
              Go
            </Button>
          </div>
          <List style={{ marginTop: "16px" }}>
            {searchResults.map((result, index) => (
              <ListItem
                key={index}
                sx={{ backgroundColor: index % 2 === 0 ? "#F0F0F0" : "white" }}
              >
                <ListItemAvatar>
                  <Avatar>{result.avatar}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={result.name} />
              </ListItem>
            ))}
          </List>
          <IconButton
            color="primary"
            style={{ position: "absolute", bottom: "16px", right: "16px" }}
            onClick={toggleDrawer}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </Drawer>
    </div>
  );
}
