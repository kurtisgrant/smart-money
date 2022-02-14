import React from 'react';
import SimulationListItem from './SimulationListItem';
import './SimulationList.scss';

const SimulationList = function ({ simulationList }) {
	const simulationListItems = simulationList.map((simulationListItem) => (
		<SimulationListItem
			key={simulationListItem.id}
			name={simulationListItem.name}
			date={simulationListItem.date}
		/>
	));

	return (
		<section className="students">
			<div className="simulation-list">{simulationListItems}</div>
		</section>
	);
};

export default SimulationList;
