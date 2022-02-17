import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import SimulationList from '../components/SimulationList';
import AddForm from '../components/AddForm';
import axios from 'axios';
import './Simulations.scss';

function Simulations() {
	const { user } = useContext(UserContext);
	const [simulationsList, setSimulationsList] = useState([]);
	const [className, setClassName] = useState('');
	const [date, setDate] = useState('');
	const navigate = useNavigate();
  const teacherId = user.id

	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/simulations/list/${teacherId}`)
			.then((res) => {
				setSimulationsList(res.data);
			});
	}, []);

	const viewSimulation = (id, name, user) => {
		navigate(`/new/${id}`, {
			state: { className: name, simulationId: id, teacherId },
		});
	};

	const deleteSimulation = (e, id) => {
		e.stopPropagation();

		axios.delete(`http://localhost:5000/api/simulations/${id}`);

		setSimulationsList(
			simulationsList.filter((simulationItem) => simulationItem.id !== id)
		);
	};

	return (
		<div className="simulations-container">
			<h1>Welcome back {user.name}!</h1>
			<div className="simulations-form-heading">
				<h2>My Simulations</h2>
				<Button green>Add Simulation</Button>
			</div>

			<AddForm
				date
				id={user.id}
				inputOnePlaceholder="Enter class name"
				inputOneValue={className}
				setInputOne={setClassName}
				inputTwoPlaceholder="Enter date (yyyy-mm-dd)"
				inputTwoValue={date}
				setInputTwo={setDate}
				list={simulationsList}
				setList={setSimulationsList}
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
