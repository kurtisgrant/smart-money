import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar';
import IndexContainer from './containers/IndexContainer';
import SimulationContainer from './containers/SimulationContainer';

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
