import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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

ChartJS.register({
  id: 'arbitraryLine',
  beforeDraw(chart, args, options) {
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;
    ctx.save();

    let xVal = options.lineIndex < 0 ? x.getPixelForValue(120) : x.getPixelForValue(options.lineIndex);
    ctx.strokeStyle = '#3DAE70';
    ctx.strokeRect(xVal, top, 0, height);
    ctx.restore();
  }
});

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
  const [options, setOptions] = useState({
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
    },
    plugins: {
      arbitraryLine: {
        lineIndex: marketData.findIndex(d => d.x === 0)
      },
      legend: {
        display: false
      }
    }
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
    });

  }, [marketData]);

  useEffect(() => {
    setOptions({
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
      },
      plugins: {
        arbitraryLine: {
          lineIndex: marketData.findIndex(d => d.x === currentMonth)
        },
        legend: {
          display: false
        }
      }
    });
  }, [currentMonth]);


  return (
    <div className='chart'>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;