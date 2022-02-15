import React from 'react';
import SimulationListItem from './SimulationListItem';
import './SimulationList.scss';

const SimulationList = function ({ simulationList, onClick, onDelete }) {
	const simulationListItems = simulationList.map((simulationListItem) => (
		<SimulationListItem
			key={simulationListItem.id}
			id={simulationListItem.id}
			name={simulationListItem.name}
			date={simulationListItem.date}
			onClick={onClick}
      onDelete={onDelete}
		/>
	));

	return (
		<section className="simulations">
			<div className="simulation-list">{simulationListItems}</div>
		</section>
	);
};

export default SimulationList;
