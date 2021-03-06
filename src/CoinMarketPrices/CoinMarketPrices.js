import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Breadcrumbs,
  Grid,
  Toolbar,
  TextField,
  Chip,
} from "@material-ui/core";
import { useQuery } from "@apollo/client";

import { GET_WATCHLIST_COINS } from ".././queries";
import { Link } from "react-router-dom";
import ListPaper from "./ListPaper";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Tooltip from "@mui/material/Tooltip";
import TableSection from "./TableSection/TableSection";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';


const CoinMarketPrices = ({
  coins,
  newAddedCoins,
  biggestGainers,
  setSteps,
}) => {
  const [crypto, setCrypto] = useState("");
  const [isWatchingList, setIsWatchingList] = useState(false);
  const [displayCoins, setDisplayCoins] = useState(coins);
  const result = useQuery(GET_WATCHLIST_COINS);
  console.log(biggestGainers);
  useEffect(() => {
    setSteps([
      {
        element: ".stepCoinMarket1",
        intro:
          "This is the trending data of the user coins that is obtained from the coin gecko api",
      },
      {
        element: ".stepCoinMarket2",
        intro: "These are one of the biggest gainers of the market right now",
      },
      {
        element: ".stepCoinMarket3",
        intro: "These are newly added coins to the current crypto market",
      },
      {
        element: ".stepCoinMarket4",
        intro: "Here you can filter the coins based on your search data",
      },
      {
        element: ".stepCoinMarket5",
        intro: "Filter your coins based on your watchlist here",
      },
      {
        element: ".stepCoinMarket6",
        intro: "Hover onto these headers for more information ",
      },
      {
        element: ".stepCoinMarket7",
        intro:
          "This is where you can favourite your coins and add them to your watchlist",
      },
    ]);
  }, [setSteps]);
  useEffect(() => {
    let filterCoins;
    if (crypto) {
      filterCoins = displayCoins.filter((el) =>
        el.name.toLowerCase().includes(crypto.toLowerCase())
      );
    } else {
      filterCoins = coins;
    }
    if (isWatchingList) {
      setDisplayCoins(
        filterCoins.filter((el) =>
          result.data.getWatchListCoins.includes(el.name)
        )
      );
    } else {
      setDisplayCoins(filterCoins);
    }
  }, [isWatchingList, crypto, coins]);

  if (result.loading) {
    return (
      <div>
        {" "}
        <h1> Loading ... sorry for the lag</h1>{" "}
      </div>
    );
  }
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
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
	color: "rgba(118, 118, 118, 1)",}}>CoinMarketPrices</Typography>
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
              to="/DashBoard/CoinMarketPrices"
            >
              CoinMarketPrices
            </Link>
          </Breadcrumbs>
        </Box>
        <Toolbar />
        <Grid container spacing={2}>
          <Grid item xs={4} className="stepCoinMarket1">
            <ListPaper
              content="Trending"
              isPercentage={true}
              toolTipContent="These are the most trending coins"
              data={biggestGainers}
            />
          </Grid>
          <Grid item xs={4} className="stepCoinMarket2">
            <ListPaper
              content="Biggest Gainers"
              toolTipContent="These are the biggest gainers"
              isPercentage={true}
              data={biggestGainers}
            />
          </Grid>

          <Grid item xs={4} className="stepCoinMarket3">
            <ListPaper content="Newly Added" toolTipContent="Newly added coins to the Cryptomarket" data={newAddedCoins} />
          </Grid>
        </Grid>
        <Typography
          variant="h4"
          style={{ marginTop: "5rem", marginLeft: "auto", marginRight: "auto" }}
        >
          Search for Cryptocurrency
        </Typography>



        <TextField
         InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}

          label="Search for Crypto"
          className="stepCoinMarket4"
          value={crypto}
          onChange={(event) => {
            setCrypto(event.target.value);
          }}
        />

      </Box>
      <Box style={{ marginTop: "2.5rem" }}>
      <Tooltip
                arrow
                title= {isWatchingList ? "stop filtering?" : "filter based on watchlist?"}
              >
        <Chip
          className="stepCoinMarket5"
          avatar={<StarBorderIcon />}
          style={{
            color: isWatchingList ? "rgb(56, 97, 251)" : "inherit",
            background: isWatchingList
              ? "rgb(240, 246, 255)"
              : "rgb(239, 242, 245)",
          }}
          label="WatchList"
          component="a"
          href="#basic-chip"
          clickable
          onClick={() => {
            setIsWatchingList(!isWatchingList);
          }}
        />
        </Tooltip>
      </Box>
      <TableSection
        watchListCoins={result.data.getWatchListCoins}
        displayCoins={displayCoins}
      />
    </div>
  );
};

export default CoinMarketPrices;
