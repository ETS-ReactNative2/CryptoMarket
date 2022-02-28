import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: false,
  maintainAspectRatio: true,
  scales: {
    y: {
      ticks: {
        display: false
      }
    },
    x: {
      ticks: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false,
      text: "Chart.js Line Chart"
    }
  }
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 2",
      data: labels.map(() => 1),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)"
    }
  ]
};

const MarketChart = () => {
  return (
    <div
      style="position:absolute; top:60px; left:10px; width:500px; height:500px;"
      style={{
        height: "20vh",
        width: "12vh"
      }}
    >
      <Line options={options} data={data} />
    </div>
  );
};

export default MarketChart;
