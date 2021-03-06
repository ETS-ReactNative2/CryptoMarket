//This is the page that displays other people portfolio or the users own portfolio

//Importing libraries
import React, { useEffect } from "react";
import {
  Typography,
  Box,
  Avatar,
  Grid,
  Breadcrumbs,
  Paper,
} from "@material-ui/core"; //For styling like bootstrap
import { Link } from "react-router-dom"; //For allowing routes
import { useParams } from "react-router-dom"; //Gets the variable from the URL header 

//Importing components
import CoinDisplayCard from "./CoinDisplayCard.js";

function PortfolioPage({ allUsers, coins, setSteps }) {
  let { account } = useParams();
  const userFound = allUsers.find((el) => el.username === account);
  useEffect(() => {
    setSteps([
      {
        element: ".profilePageStep1",
        intro:
          "This is where you can view the image of the searched account or your own portfolio",
      },
      {
        element: ".profilePageStep2",
        intro: "If you have written something, it would display here",
      },
      {
        element: ".profilePageStep3",
        intro:
          "Here you can view the coins that is owned by the searched account or your own portfolio",
      },
    ]);
  }, [setSteps]);
  if (!userFound) {
    return (
      <div>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" style={{	fontWeight: 400,
	padding: 0,
	textTransform: "uppercase",
	fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
	color: "rgba(118, 118, 118, 1)",}}>User does not exist</Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              style={{ textDecoration: "none", color: "black" }}
              underline="hover"
              color="inherit"
              to="/DashBoard"
            >
              Dashboard
            </Link>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              underline="hover"
              color="inherit"
              to={`/DashBoard/Portfolio/${account}`}
            >
              Profile Page
            </Link>
          </Breadcrumbs>
        </Box>{" "}
      </div>
    );
  }
  console.log(account);
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" style={{	fontWeight: 400,
	padding: 0,
	textTransform: "uppercase",
	fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
	color: "rgba(118, 118, 118, 1)",}}>
          {userFound.name} {userFound.lastName}
          {" Portfolio Page"}
        </Typography>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            style={{ textDecoration: "none", color: "black" }}
            underline="hover"
            color="inherit"
            to="/DashBoard"
          >
            Dashboard
          </Link>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            underline="hover"
            color="inherit"
            to={`/DashBoard/Portfolio/${account}`}
          >
            Profile Page
          </Link>
        </Breadcrumbs>
      </Box>
      <Box flexGrow={1} />
      <Grid container style={{ marginTop: "10vh" }}>
        <Grid item xs={6}>
          <Avatar
            style={{ height: "25rem", width: "25rem" }}
            src={userFound.imageProfile}
            className="profilePageStep1"
          />
        </Grid>
        <Grid item xs={6}>
          <Typography style={{ fontSize: "2rem" }} color="primary">
            {" "}
            About me:
          </Typography>
          <Paper
            className="profilePageStep2"
            style={{
              background: "#e5e4e2",
              padding: "1rem",
              height: "40vh",
              fontFamily:
                "Big Caslon,Book Antiqua,Palatino Linotype,Georgia,serif",
            }}
          >
            <Typography style={{ display: "block" }} variant="body1">
              {" "}
              {!userFound.aboutMe
                ? "We are sure this guy is really good, it is just that he is a little too shy to talk about himself"
                : userFound.aboutMe}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Typography style={{ marginTop: "10vh" }} variant="h4" color="primary">
        Portfolio Coins
      </Typography>
      <Box style={{ marginTop: "10vh" }} className="profilePageStep3">
        {userFound.portfolioCoins.map((coin) => {
          return (
            <CoinDisplayCard
              coin={coin}
              actualCoin={coins.find((el) => el.name === coin.name)}
            />
          );
        })}
      </Box>
    </div>
  );
}

export default PortfolioPage;
