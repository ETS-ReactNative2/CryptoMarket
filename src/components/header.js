import React from "react";

export default function Header() {
  return (
    <header>
      <div className="header-inner">
        <div className="logo">CrySim.</div>
        <nav>
          <ul>
            <li>
              <a href="/">discover</a>
            </li>
            <li>
              <a href="/">CoinMarketCap</a>
            </li>
            <li>
              <a href="/">Contact</a>
            </li>
            <li>
              <a href="/">About</a>
            </li>
            <li className="btn">
              <a href="/">Login</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
