import React from 'react';
import { Bar } from 'react-chartjs-2';

function BarChart({ dataChart, label = '' }) {
  const data = {
    labels: dataChart.labels || [],
    datasets: [
      {
        label,
        backgroundColor: 'rgba(55, 152, 252,0.2)',
        borderColor: 'rgba(55, 152, 252,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(55, 152, 252,0.4)',
        hoverBorderColor: 'rgba(55, 152, 252,1)',
        data: dataChart.data || []
      }
    ]
  };

  return (
    <Bar
      data={data}
      height={485}
      options={{
        maintainAspectRatio: false
      }}
    />
  );
}

export default BarChart;
