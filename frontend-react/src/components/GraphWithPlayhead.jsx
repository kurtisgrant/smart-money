import React, { useRef, useState, useEffect } from 'react';
import { Chart } from 'chart.js';

function GraphWithPlayhead({ marketData, currentMonth, zeroIndex }) {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);


  // TODO: Update chart on new data. Not working yet.
  // useEffect(() => {
  //   if (!chart) return;
  //   const workingData = marketData.map((price, i) => {
  //     return { x: i - zeroIndex, y: price };
  //   })

  //   setChart(prevChart => {
  //     prevChart.data.datasets.data = workingData;
  //     return prevChart.update();
  //   });

  // }, [marketData]);

  useEffect(() => {
    if (!chartRef) return;

    const workingData = marketData.map((price, i) => {
      return { x: i - zeroIndex, y: price };
    });
    const labels = [...Array(workingData.length).keys()].map(n => n - zeroIndex);

    const ctx = chartRef.current.getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Market Index',
          data: workingData,
          borderColor: '#3DAE70',
          backgroundColor: '#3DAE7088',
          pointStyle: 'none',
        }]
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        },
        scales: {
          y: {
            beginsAtZero: true
          },
          x: {
            ticks: {
              maxTicksLimit: Math.floor(marketData.length / 24)
            }
          }
        }
      }
    });

    setChart(newChart);
  }, [chartRef]);

  if (!chartRef) return;

  return (
    <div className="chart-container">
      <canvas ref={chartRef} id="market-data" width="600" height="320"></canvas>
    </div>
  );
}



export default GraphWithPlayhead;