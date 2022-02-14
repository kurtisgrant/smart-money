import React from 'react';
import SimulationListItem from './SimulationListItem';
import './SimulationList.scss'

const SimulationList = function ({ List }) {
	const listItems = List.map((listItem) => (
		<SimulationListItem key={listItem.id} name={listItem.name} date={listItem.date} />
	));

	return (
		<section className="students">
			<div className="simulation-list">{listItems}</div>
		</section>
	);
};

export default SimulationList;
