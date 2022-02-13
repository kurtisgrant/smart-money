import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Button from './components/Button';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Chart from './components/Chart';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Button green onClick={() => console.log('clicked')} />
      <Button white onClick={() => console.log('clicked')} />
      <Chart />
    </div>
  );
}

export default App;
