import React from "react";
import Container from "@mui/material/Container";
import { Box, Typography } from "@mui/material";
import Tabs from "../Components/Tab";
function Home() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          height: "10%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px",
        }}
      >
        <Typography fontSize={"2rem"} fontFamily={"work sans"}>
          Chat-APP
        </Typography>
      </Box>
      <Box
        sx={{
          bgcolor: "white",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "top",
          borderRadius: "10px",
          margin: "3%",
        }}
      >
        <Tabs />
      </Box>
    </Container>
  );
}

export default Home;
