import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import { SocketContext } from './SocketContext';
import { Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import './styles/App.scss';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Simulations from './pages/Simulations';
import SimulationControlPanel from './pages/SimulationControlPanel';
import StudentDashboard from './pages/StudentDashboard';
import AccessCodeLogin from './pages/AccessCodeLogin';
import NewSimulation from './pages/NewSimulation';

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:4545');
    socket.on('connect', () => {
      console.log(`Socket connection established (in App.jsx)\nMy client id is: ${socket.id}`)
    })
    setSocket(socket);
  }, []);

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
        <SocketContext.Provider value={{ socket }}>
          <Navbar />
          <div className="main-container">
            <Routes>
              <Route path="/" element={user?.type === 'teacher' ? <Simulations /> : <Login />} />
              <Route path="/sim/:simulationKey" element={
                user?.type === 'teacher' ? <SimulationControlPanel /> :
                  (user?.type === 'student' ? <StudentDashboard /> : <AccessCodeLogin />)} />
              <Route path="/new" element={user?.type === 'teacher' ? <NewSimulation /> : <Login />} />
            </Routes>
          </div>
        </SocketContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
