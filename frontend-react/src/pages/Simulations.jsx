import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import SimulationList from '../components/SimulationList';
import AddForm from '../components/AddForm';
import './Simulations.scss';

function Simulations({ user }) {
  const [simulationsList, setSimulationsList] = useState([]);
  const [className, setClassName] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  // const viewSimulation = (id, name) => {
  //   navigate(`/${id}`, {
  //     state: { className: name }
  //   });
  // };

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
        date
        inputOnePlaceholder="Enter class name"
        inputOneValue={className}
        setInputOne={setClassName}
        inputTwoPlaceholder="Enter date"
        inputTwoValue={date}
        setInputTwo={setDate}
        list={simulationsList}
        setList={setSimulationsList}
      />

      <SimulationList
        simulationList={simulationsList}
        onDelete={deleteSimulation}
        // onClick={viewSimulation}
      />
    </div>
  );
}

export default Simulations;
