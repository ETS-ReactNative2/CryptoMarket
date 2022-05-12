import React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import "./TopSection.css";
import { useNavigate } from "react-router-dom";

const TopSection = () => {
  let navigate = useNavigate();

  return (
    <div>
      <Box className="video-container">
        <video
          src="/videos/Video1.mp4"
          className="filter"
          autoPlay
          loop
          muted
        />
        <Typography variant="h2" className="header-text">
          Begin your journey with crypto now
        </Typography>
        <Button
          className="btn--outline"
          style={{
            backgroundColor: "transparent",
            color: "#fff",
            padding: "8px 20px",
            border: "1px solid var(--primary)",
            transition: "all 0.3s ease-out",
          }}
          onClick={() => {
            navigate("/SignUp");
          }}
          variant="contained"
          disableElevation
        >
          {" "}
          Register Now
        </Button>
        <Button
          className="explore-button"
          style={{ marginTop: 10 }}
          variant="contained"
          disableElevation
        >
          {" "}
          Explore features now{" "}
        </Button>
      </Box>
    </div>
  );
};

export default TopSection;