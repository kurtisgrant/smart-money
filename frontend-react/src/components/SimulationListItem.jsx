import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import './SimulationListItem.scss';

const SimulationListItem = function ({ name, date }) {

	return (
		<div className="student-item">
			<div className="col-1">{name}</div>
			<div className="col-2">{date}</div>
			<div className="col-3">
				<FaTrashAlt size={15} />
			</div>
		</div>
	);
};

export default SimulationListItem;
