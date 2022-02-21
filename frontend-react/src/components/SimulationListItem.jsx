import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import './SimulationListItem.scss';

const SimulationListItem = function ({ simulation, onDelete }) {
	let navigate = useNavigate();

	const viewSimulation = () => {
		navigate(`/sim/${simulation.simulation_key}`, { replace: true });
	};

	return (
		<tr className="simulation-item" onClick={viewSimulation}>
			<td className="col-1">{simulation.name}</td>
			<td className="col-2">{simulation.date.slice(0, 10)}</td>
			<td className="col-3">
				<FaTrashAlt size={15} onClick={(e) => onDelete(e, simulation.id)} />
			</td>
		</tr>
	);
};

export default SimulationListItem;
