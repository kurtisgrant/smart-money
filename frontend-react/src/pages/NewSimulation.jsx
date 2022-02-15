import React, { useEffect, useState } from 'react';
import generateMockMarketData from '../helpers/generateMockMarketData';
import GraphWithPlayhead from '../components/GraphWithPlayhead';
import Button from '../components/Button';

function NewSimulation() {
  const [randomMarketData, setRandomMarketData] = useState([]);

  const randomizeMarketData = () => {
    const data = getRandomMarketData();
    setRandomMarketData(data);
  };
  useEffect(() => {
    randomizeMarketData();
  }, []);


  if (!randomMarketData.length) return null;
  return (
    <div>
      <h1>New Simulation</h1>
      <GraphWithPlayhead marketData={randomMarketData} currentMonth={0} zeroIndex={10 * 12} />
    </div>
  );
}

const getRandomMarketData = () => {
  return generateMockMarketData({
    firstYearSeed: 1950, // Min: 1871
    lastYearSeed: 2015, // Max: 2018
    adjustForInflation: true, // true: Adjust to Today's dollars, false: Allow inflation
    startPrice: 10, // First price in fake market data
    months: 720, // How many months of data do you want?
  });
};

export default NewSimulation;