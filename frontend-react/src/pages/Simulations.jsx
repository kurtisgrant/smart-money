import React, { useState } from 'react';
import Button from '../components/Button';
import SimulationList from '../components/SimulationList';
import './Simulations.scss';

function Simulations({ user }) {
	const [simulationsList, setSimulationsList] = useState([]);
	const [className, setClassName] = useState('');
	const [date, setDate] = useState('');

	// setSimulationsList ([
	// 	{
	// 		id: 1,
	// 		name: 'Class 1A11',
	// 		date: 'February 12, 2022',
	// 	},
	// 	{
	// 		id: 2,
	// 		name: 'Class 2B22',
	// 		date: 'February 13, 2022',
	// 	},
	// 	{
	// 		id: 3,
	// 		name: 'Class 3C33',
	// 		date: 'February 14, 2022',
	// 	},
	// ]);

	const onSubmit = (e) => {
		e.preventDefault();

		if (!className || !date) alert('Please fill out both class name and date.');

		setSimulationsList((prev) => [
			...prev,
			{ id: simulationsList.length + 1, name: className, date },
		]);

		setClassName('');
		setDate('');
	};

	return (
		<div className="simulations-container">
			<h1>Welcome back {user.name}!</h1>
			<div className="subheading">
				<h2>My Simulations</h2>
				<Button green>Add Simulation</Button>
			</div>

			<form className="add-form" onSubmit={onSubmit}>
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
				<Button white type="submit">
					Submit
				</Button>
			</form>

			<SimulationList simulationList={simulationsList} />
		</div>
	);
}

export default Simulations;
