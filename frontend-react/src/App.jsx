import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import Navbar from './components/Navbar';
import IndexContainer from './containers/IndexContainer';
import SimulationContainer from './containers/SimulationContainer';
import NewSimulation from './pages/NewSimulation';

function App() {
  const [appState, setAppState] = useState({ user: null });
  const setUser = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    setAppState({ ...appState, user });
  };
  const logout = () => {
    sessionStorage.removeItem('user');
    setAppState({ ...appState, user: null });
  };

  useEffect(() => {
    const sessionUser = JSON.parse(sessionStorage.getItem('user'));
    console.log('Setting user from session storage: ', sessionUser);
    sessionUser && setUser(sessionUser);
  }, []);

  return (
    <div className="App">
      <Navbar appState={appState} logout={logout} />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<IndexContainer user={appState.user} setUser={setUser} />} />
          <Route path="/sim/:simulation_key" element={<SimulationContainer user={appState.user} setUser={setUser} />} />
          <Route path="/new" element={<NewSimulation />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
