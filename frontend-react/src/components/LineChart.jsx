import React from 'react';
import { Line } from 'react-chartjs-2';
import './LineChart.scss';
import Chart from 'chart.js/auto';
import Button from './Button';


const LineChart = (function () {
  return (
    <div className='chart'>
    <Line 
    data={{
      labels: [-20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
      datasets: [{
        label: 'S&P 500',
        data: [10, 12, 15, 18, 16, 14, 17, 18, 15, 12, 14, 16, 20, 24, 15, 21, 24, 26, 33, 29, 27,10, 12, 15, 18, 16, 14, 17, 18, 15, 12, 14, 16, 20, 24, 15, 21, 24, 26, 33, 29, 27,10, 12, 15, 18, 16, 14, 17, 18, 15, 12, 14, 16, 20, 24, 15, 21, 24, 26, 33, 29, 27,10, 12, 15, 18, 16, 14, 17, 18, 15, 12, 14, 16, 20, 24, 15, 21, 24, 26, 33, 29, 27],
        fill: false,
        borderColor: 'green', 
        tension: 0
      }]
    }}
   
    />
    <Button />
    </div>
  )
})

export default LineChart;