import React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import "../App.scss";
import "./BodySection.css";

const BodySection = () => {
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
        <Typography className="header-text">
          Begin your journey with crypto now
        </Typography>
        <Button className="btn--outline" variant="contained" disableElevation>
          {" "}
          Register Now
        </Button>
        <Button
          className="explore-button"
          buttonSize="btn--large"
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

export default BodySection;
