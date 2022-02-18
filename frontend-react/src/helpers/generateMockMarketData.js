import { deviation, mean } from 'd3';
import sp500 from '../data/parsed_SP500';

export default function generateMarketData(options) {
  const {
    firstYearSeed,
    lastYearSeed,
    adjustForInflation,
    startPrice,
    months,
  } = options;

  // Filter data from sp500 to get only requested years
  const historicalSP500 = sp500.filter(row => {
    const year = Number(row.date.slice(0, 4));
    return (year >= firstYearSeed && year <= lastYearSeed);
  });

  // Get average pcnt change and average standard deviation between months of data
  const [
    monthlyMeanChange,
    monthlyStdDevChange
  ] = getMonthlyMeanAndStdDevChanges(historicalSP500, adjustForInflation);


  // Initialize array to hold market data
  const simMktData = [startPrice];

  // Loop for X months of data, adding each prediction one at a time
  // Start at 1, since startPrice is provided
  for (let i = 1; i < months; i++) {

    // Get prediction based on last price added
    const price = getProjectedMarketPrice(
      simMktData[simMktData.length - 1],
      monthlyMeanChange,
      monthlyStdDevChange
    );
    simMktData.push(Number(price.toFixed(2)));
  }

  return simMktData;
};


const getMonthlyMeanAndStdDevChanges = (data, useRealPrices) => {

  // Depending whether we want inflation or not, 
  // we'll use this key to access the correct 
  // data from the filtered historical data
  const priceKey = useRealPrices ? 'yr2000Price' : 'price';

  // Array for the percent change +/- between
  // each month of historical data
  const marketMonthPcntChanges = [];

  // Loop through data, calculating pcnt changes
  // Start at second month
  for (let i = 1; i < data.length; i++) {

    const thisMonthPrice = data[i][priceKey];
    const prevMonthPrice = data[i - 1][priceKey];
    marketMonthPcntChanges.push((thisMonthPrice - prevMonthPrice) / prevMonthPrice);
  }

  // Use d3 functions to get average pcnt change and average standard deviation
  const meanMonthlyChange = mean(marketMonthPcntChanges);
  const stdDevMonthlyChange = deviation(marketMonthPcntChanges);

  return [meanMonthlyChange, stdDevMonthlyChange];

};


const getProjectedMarketPrice = (currentPrice, monthlyMeanChange, monthlyStdDevChange) => {
  const drift = monthlyMeanChange - (monthlyStdDevChange * monthlyStdDevChange) / 2;
  const volatility = monthlyStdDevChange * normal(Math.random());
  return currentPrice * Math.exp(drift + volatility);
};


/*
Inverse standard normal cumulative distribution

Based on Peter John Acklman's algorithm:
https://web.archive.org/web/20151030212308/http://home.online.no/~pjacklam/notes/invnorm/index.html#Other_algorithms

Adapted from Danny Libin's implementation:
https://github.com/Daynil/quests-in-code/blob/master/src/utils/normSinv.ts

*/
const normal = (p) => {
  const a1 = -3.969683028665376e1;
  const a2 = 2.209460984245205e2;
  const a3 = -2.759285104469687e2;
  const a4 = 1.38357751867269e2;
  const a5 = -3.066479806614716e1;
  const a6 = 2.506628277459239;

  const b1 = -5.447609879822406e1;
  const b2 = 1.615858368580409e2;
  const b3 = -1.556989798598866e2;
  const b4 = 6.680131188771972e1;
  const b5 = -1.328068155288572e1;

  const c1 = -7.784894002430293e-3;
  const c2 = -3.223964580411365e-1;
  const c3 = -2.400758277161838;
  const c4 = -2.549732539343734;
  const c5 = 4.374664141464968;
  const c6 = 2.938163982698783;

  const d1 = 7.784695709041462e-3;
  const d2 = 3.224671290700398e-1;
  const d3 = 2.445134137142996;
  const d4 = 3.754408661907416;

  const p_low = 0.02425;
  const p_high = 1 - p_low;

  let q;

  // Rational approximation for lower region
  if (0 < p && p < p_low) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1)
    );
  }

  // Rational approximation for central region
  if (p_low <= p && p <= p_high) {
    q = p - 0.5;
    const r = q * q;
    return (
      ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
      (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1)
    );
  }

  // Rational approximation for upper region
  if (p_high < p && p < 1) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1)
    );
  }
};