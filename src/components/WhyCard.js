import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

export default function WhyCard({ image, content }) {
  return (
    <Card
      elevation={0}
      sx={{ maxWidth: "300px", minHeight: "100px", margin: "10px" }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="80"
          image={`/Images/${image}.png`}
          alt={`${image}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {image}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {content}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
