import React, { useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";
import { Divider } from "@material-ui/core";

//Components
import BodySection from "./components/BodySection";
import MiddleSection from "./components/MiddleSection";
import Header from "./components/header";
import TableSection from "./components/TableSection";

export default function App() {
  const [coins, setCoins] = useState([]);
  useEffect(() => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      )
      .then((res) => {
        setCoins(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  });

  return (
    <>
      <Header />
      <BodySection />
      <MiddleSection />
      <Divider variant="middle" light className="divider-sml" />
      <TableSection coins={coins} />
    </>
  );
}
