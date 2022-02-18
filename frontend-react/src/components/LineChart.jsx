import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './LineChart.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.pluginService.register({
  
})

export const options = {
  responsive: true,
  elements: {
    point: {
      radius: 0
    }
  },
  scales: {
    x: {
      grid: {
        drawOnChartArea: false,
        drawTicks: false
      },
      ticks: {
        autoSkip: false
      }
    },
    y: {
      ticks: {
        callback: function(index) {
          return '$' + index;
        }
      }
    }
  }
};

const LineChart = ({ marketData, currentMonth }) => {

  const [data, setData] = useState({
    labels: marketData.map(d => d.x % 60 === 0 ? d.x / 12 : ''),
    datasets: [{
      label: 'Market Index',
      data: marketData.map(d => d.y),
      fill: false,
      borderColor: '#3DAE70',
      tension: 0
    }]
  });

  useEffect(() => {
    setData({
      labels: marketData.map(d => d.x % 60 === 0 ? d.x / 12 : ''),
      datasets: [{
        label: 'Market Index',
        data: marketData.map(d => d.y),
        fill: false,
        borderColor: '#3DAE70',
        tension: 0
      }]
    })

  }, [marketData])


  return (
    <div className='chart'>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;