import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import './SimulationListItem.scss';

const SimulationListItem = function({ simulation, onDelete }) {
	return (
		<li>
			<Link to={`/sim/${simulation.simulation_key}`}>
				<div className="simulation-item" >
					<div className="col-1">{simulation.name}</div>
					<div className="col-2">{simulation.date.slice(0, 10)}</div>
					<div className="col-3">
						<FaTrashAlt size={15} onClick={(e) => onDelete(e, simulation.id)} />
					</div>
				</div>
			</Link>
		</li>
	);
};

export default SimulationListItem;
