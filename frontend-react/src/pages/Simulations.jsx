import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import AddForm from '../components/AddForm';
import axios from 'axios';
import './Simulations.scss';
import SimulationListItem from '../components/SimulationListItem';

function Simulations() {
	const { user } = useContext(UserContext);
	const [simulations, setSimulations] = useState([]);
	const [className, setClassName] = useState('');
	const [date, setDate] = useState('');
	const teacherId = user.id;

	useEffect(() => {
		axios
			.get(`/api/simulations/list/${teacherId}`)
			.then((res) => {
				setSimulations(res.data);
			});
	}, []);

	const deleteSimulation = (e, id) => {
		e.preventDefault();

		axios.delete(`/api/simulations/${id}`);

		setSimulations(
			simulations.filter((simulationItem) => simulationItem.id !== id)
		);
	};

	return (
		<div className="simulations-container">
			<h1>Welcome back {user.name}!</h1>
			<div className="simulations-form-heading">
				<h2>My Simulations</h2>
				<Link to="/new"><Button green>Add Simulation</Button></Link>
			</div>

			<section className="simulations">
				<ul className="simulation-list">
					{simulations.map(simulation => <SimulationListItem
						key={simulation.id}
						simulation={simulation}
						onDelete={deleteSimulation}
					/>)}
				</ul>
			</section>
		</div>
	);
}

export default Simulations;
