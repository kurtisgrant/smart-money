import React, { useState } from 'react';
import Button from '../components/Button';
import SimulationList from '../components/SimulationList';
import AddForm from '../components/AddForm';
import './Simulations.scss';

function Simulations({ user }) {
	const [simulationsList, setSimulationsList] = useState([]);
	const [className, setClassName] = useState('');
	const [date, setDate] = useState('');

  const onSubmit = (e) => {
		e.preventDefault();

		if (!className || !date) {
      return alert('Please fill out both class name and date.')
    }

		setSimulationsList((prev) => [
			...prev,
			{ id: simulationsList.length + 1, name: className, date },
		]);

		setClassName('');
		setDate('');
	};

  const deleteSimulation = (id) => {
    setSimulationsList(simulationsList.filter((simulationItem) => simulationItem.id !== id));
  }

	return (
		<div className="simulations-container">
			<h1>Welcome back {user.name}!</h1>
			<div className="subheading">
				<h2>My Simulations</h2>
				<Button green>Add Simulation</Button>
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

			{/* <form className="add-form" onSubmit={onSubmit}>
				<input
					type="text"
					placeholder="Enter class name"
					value={className}
					onChange={(e) => setClassName(e.target.value)}
				/>
				<input
					type="text"
					placeholder="Enter date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
				/>
				<Button green type="submit">
					Submit
				</Button>
			</form> */}

			<SimulationList simulationList={simulationsList} onDelete={deleteSimulation} />
		</div>
	);
}

export default Simulations;
