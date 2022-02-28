//Importing react libraries
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { Typography } from "@material-ui/core";

//Importing css files
import "./TableSectionTable.css";

//Importing components
import MarketChart from "./MarketChart";

export default function AcccessibleTable({ coins }) {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table aria-label="caption table">
        <caption>A basic table example with a caption</caption>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Last Price</TableCell>
            <TableCell align="right">24h change</TableCell>
            <TableCell align="right">Market</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coins.map((coin) => (
            <TableRow key={coin.name}>
              <TableCell component="th" scope="row">
                <>
                  <Avatar alt="Some cryptocurrency icon" src={coin.image} />{" "}
                  <Typography sx={{ display: "inline" }}>
                    {" "}
                    {coin.name}{" "}
                  </Typography>
                </>
              </TableCell>
              <TableCell align="right">
                {" "}
                <Typography sx={{ fontFamily: "Times New Roman" }}>
                  ${coin.current_price}{" "}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <p1
                  style={{
                    color: `${
                      coin.market_cap_change_percentage_24h < 0
                        ? "red"
                        : "green"
                    }`
                  }}
                >
                  {coin.market_cap_change_percentage_24h}{" "}
                </p1>
              </TableCell>
              <TableCell align="right">
                {" "}
                <MarketChart coinName={coin.name} />{" "}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
