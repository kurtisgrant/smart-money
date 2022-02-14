import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar';
import IndexContainer from './containers/IndexContainer';
import SimulationContainer from './containers/SimulationContainer';

// Temp for testing
// (See console in browser to view data)
import generateMarketData from './helpers/generateMockMarketData';
generateMarketData({
  firstYearSeed: 1915, // Min: 1871
  lastYearSeed: 2015, // Max: 2018
  adjustForInflation: true, // true: Adjust to Today's dollars, false: Allow inflation
  startPrice: 10, // First price in fake market data
  months: 720, // How many months of data do you want?
});

function App() {
  const [appState, setAppState] = useState({ user: null });
  const setUser = (user) => {
    setAppState({ ...appState, user });
  };

  return (
    <div className="App">
      <Navbar appState={appState} />
      <Routes>
        <Route path="/" element={<IndexContainer user={appState.user} setUser={setUser} />} />
        <Route path="/sim/:simulation_key" element={<SimulationContainer user={appState.user} setUser={setUser} />} />
      </Routes>
    </div>
  );
}

export default App;
