import React from 'react';
import './Chart.scss';
import Button from './Button';


const Chart = () => {
  return(
    <div>
      <div className="data-chart">
        
      </div>
      <div className="chart-btns">
        <Button green>Play</Button>
        <Button white>Pause</Button>
      </div>
    </div>
  )
}

export default Chart;