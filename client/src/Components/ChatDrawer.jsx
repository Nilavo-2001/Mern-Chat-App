import React, { useContext, useState } from "react";
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
import { Tooltip, Typography, Skeleton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { error as errorToast } from "../utils/toast";
import { chatContext } from "../context/chatProvider";

export default function ChatDrawer() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(chatContext);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const handleSearch = async () => {
    // Clear previous search results
    setSearchResult([]);

    if (searchQuery === "") {
      errorToast("No Username Provided");
      return;
    }
    try {
      setLoading(true);
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
          <List sx={{ marginTop: "16px" }}>
            {loading
              ? Array.from({ length: 10 }, (_, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Skeleton variant="circular" width={40} height={40} />
                    </ListItemAvatar>
                    <ListItemText>
                      <Skeleton width={150} />
                    </ListItemText>
                  </ListItem>
                ))
              : searchResult.map((result, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      cursor: "pointer",
                      bgcolor: "lightgrey",
                      ":hover": { bgcolor: "grey" },
                      marginBottom: "5px",
                      borderRadius: "10px",
                    }}
                  >
                    {result.pic && (
                      <ListItemAvatar>
                        <Avatar src={result.pic} />
                      </ListItemAvatar>
                    )}
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
