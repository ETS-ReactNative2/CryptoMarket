import React from "react";
import { Typography, Box } from "@material-ui/core";
import WhyCard from "./WhyCard";
import "./MiddleSection.css";

const MiddleSection = () => {
  return (
    <section className="middlesection-canvas">
      <Typography variant="h3" className="middlesection-h1">
        What makes us better
      </Typography>
      <Box
        className="touch-container"
        sx={{ display: "flex", flexDirection: "row", minWidth: "100vh" }}
      >
        <WhyCard
          image="Careers"
          content="Start building your career through expanding your portfolio."
        />
        <WhyCard
          image="Community"
          content="CrySim is global, get access to a world wide commnuity and discuss."
        />
        <WhyCard
          image="CryptoMarket"
          content="Get access to hundreds of coins to play with"
        />
        <WhyCard image="Support" content="24/7 support and assistance." />
      </Box>
    </section>
  );
};

export default MiddleSection;
