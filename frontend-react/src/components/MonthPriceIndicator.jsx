import React from 'react';
import './MonthPriceIndicator.scss';

function MonthPriceIndicator({ currentMonth, marketData }) {
  const dataPoint = marketData.find(dataPoint => dataPoint.x === currentMonth);
  const price = dataPoint?.y?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const year = Math.floor(currentMonth / 12);
  const monthOfYear = currentMonth % 12 + 1;
  return (
    <div className="month-price-container">
      <div>
      Year: {year} Month: {monthOfYear} 
      </div>
      <div>
        $ {price} / share
      </div>
    </div>
  );
}

export default MonthPriceIndicator;