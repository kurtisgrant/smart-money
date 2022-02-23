import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import axios from 'axios';
import './Simulations.scss';
import SimulationListItem from '../components/SimulationListItem';

function Simulations() {
	const { user } = useContext(UserContext);
	const [simulations, setSimulations] = useState([]);
	const teacherId = user.id;

	useEffect(() => {
		axios
			.get(`/api/simulations/list/${teacherId}`)
			.then((res) => {
				setSimulations(res.data);
			})
			.catch((err) => console.log(err.message));
	}, []);

	const deleteSimulation = (e, id) => {
		e.stopPropagation();

		axios
			.delete(`/api/simulations/${id}`)
			.then(() => {
				setSimulations(
					simulations.filter((simulationItem) => simulationItem.id !== id)
				);
			})
			.catch((err) => console.log(err.message));
	};

	return (
		<div className="simulations-container">
			<h1>Welcome back {user.name}!</h1>
			<div className="simulations-form-heading">
				<h2>My Simulations</h2>
				<Link to="/new">
					<Button green>Add Simulation</Button>
				</Link>
			</div>

			<section className="simulations">
				{simulations.length > 0 ? (
					<table className="simulation-list">
						<tbody>
							<tr>
								<th className="head-col-1">Simulation Name</th>
								<th className="head-col-2">Created Date</th>
								<th className="head-col-3">Delete</th>
							</tr>
							{simulations.length > 0 &&
								simulations.map((simulation) => (
									<SimulationListItem
										key={simulation.id}
										simulation={simulation}
										onDelete={deleteSimulation}
									/>
								))}
						</tbody>
					</table>
				) : (
					<div className="simulation-empty">
						No saved simulations
					</div>
				)}
			</section>
		</div>
	);
}

export default Simulations;
