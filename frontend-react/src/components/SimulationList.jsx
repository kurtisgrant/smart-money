import React from 'react';
import SimulationListItem from './SimulationListItem';
import './SimulationList.scss';

const SimulationList = function ({ simulationList, onDelete }) {
	const simulationListItems = simulationList.map((simulationListItem) => (
		<SimulationListItem
			key={simulationListItem.id}
			id={simulationListItem.id}
			name={simulationListItem.name}
			date={simulationListItem.date}
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
