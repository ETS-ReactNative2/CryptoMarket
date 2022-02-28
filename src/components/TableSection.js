import React from "react";
import "./TableSection.css";
import TableSectionTable from "./TableSectionTable";
import { Typography } from "@material-ui/core";
const TableSection = ({ coins }) => {
  return (
    <section className="table-section-canvas">
      <Typography variant="h4">Current Market Trend</Typography>
      <TableSectionTable coins={coins} />
    </section>
  );
};

export default TableSection;
