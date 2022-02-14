import { deviation, mean } from 'd3';
import sp500 from '../data/parsed_SP500';

const generateMarketDataFromYrRange = (firstYear, lastYear) => {
  const data = sp500.filter(row => {
    const year = Number(row.date.slice(0, 4));
    return (year >= firstYear && year <= lastYear);
  });

  const [
    monthlyMeanChange, 
    monthlyStdDevChange
  ] = getMonthlyMeanAndStdDevChanges(data);

  return 'todo'

};

const getMonthlyMeanAndStdDevChanges = (data) => {

  let marketMonthPcntChanges = [];

  // Start at second month
  for (let i = 1; i < data.length; i++) {
    const thisMonthPrice = data[i].price;
    const prevMonthPrice = data[i - 1].price;
    marketMonthPcntChanges.push((thisMonthPrice - prevMonthPrice) / prevMonthPrice);
  }

  const meanMonthlyChange = mean(marketMonthPcntChanges)
  const stdDevMonthlyChange = deviation(marketMonthPcntChanges)

  return [meanMonthlyChange, stdDevMonthlyChange]

};

export default generateMarketDataFromYrRange;