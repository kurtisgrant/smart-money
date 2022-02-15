import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import SimulationList from '../components/SimulationList';
import AddForm from '../components/AddForm';
import './Simulations.scss';

function Simulations() {
  const { user } = useContext(UserContext);
  const [simulationsList, setSimulationsList] = useState([]);
  const [className, setClassName] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();


  const onSubmit = (e) => {
    e.preventDefault();

    if (!className || !date) {
      return alert('Please fill out both class name and date.');
    }

    setSimulationsList((prev) => [
      ...prev,
      { id: simulationsList.length + 1, name: className, date },
    ]);

    setClassName('');
    setDate('');
  };

  const viewSimulation = (id, name) => {
    navigate(`/${id}`, {
      state: { className: name }
    });
  };

  const deleteSimulation = (id) => {
    setSimulationsList(
      simulationsList.filter((simulationItem) => simulationItem.id !== id)
    );
  };

  return (
    <div className="simulations-container">
      <h1>Welcome back {user.name}!</h1>
      <div className="simulations-form-heading">
        <h2>My Simulations</h2>
        <Link to="/new"><Button green>Add Simulation</Button></Link>
      </div>

      <AddForm
        onSubmit={onSubmit}
        inputOnePlaceholder="Enter class name"
        inputOneValue={className}
        setInputOne={setClassName}
        inputTwoPlaceholder="Enter date"
        inputTwoValue={date}
        setInputTwo={setDate}
      />

      <SimulationList
        simulationList={simulationsList}
        onClick={viewSimulation}
        onDelete={deleteSimulation}
      />
    </div>
  );
}

export default Simulations;
