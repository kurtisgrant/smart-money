import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import { Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Simulations from './pages/Simulations';
import SimulationControlPanel from './pages/SimulationControlPanel';
import StudentDashboard from './pages/StudentDashboard';
import AccessCodeLogin from './pages/AccessCodeLogin';
import NewSimulation from './pages/NewSimulation';

function App() {

  const [user, setUserState] = useState(null);

  const setUser = (user) => {
    if (user === null) {
      sessionStorage.removeItem('user');
      setUserState(null);
    } else {
      sessionStorage.setItem('user', JSON.stringify(user));
      setUserState(user);
    }
  };

  useEffect(() => {
    const sessionUser = JSON.parse(sessionStorage.getItem('user'));
    console.log('Setting user from session storage: ', sessionUser);
    sessionUser && setUser(sessionUser);
  }, []);

  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser }}>
        <Navbar />
        <div className="main-container">
          <Routes>
            <Route path="/" element={user?.type === 'teacher' ? <Simulations /> : <Login />} />
            <Route path="/sim/:simulationKey" element={
              user?.type === 'teacher' ? <SimulationControlPanel /> :
                (user?.type === 'student' ? <StudentDashboard /> : <AccessCodeLogin />)} />
            <Route path="/new/:simId" element={user?.type === 'teacher' ? <NewSimulation /> : <Login />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </div>
  );
}

export default App;
