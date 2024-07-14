import React, { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UserChart = ({ data }) => {
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    setCurrentYear(year);
  }, []);

  const chartData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Số người mượn sách',
        data: data,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4, // This property makes the line smoother
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Người mượn sách hàng tháng trong năm ${currentYear}`,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default UserChart;
