import React from 'react';
import Button from '../components/Button';
import List from '../components/SimulationList';
import './Simulations.scss'

function Simulations({ user }) {
  const simulationsListArray = [{
    id: 1,
    name: "Class 1A11",
    date: "February 12, 2022",
  },
  {
    id: 2,
    name: "Class 2B22",
    date: "February 13, 2022",
  },
  {
    id: 3,
    name: "Class 3C33",
    date: "February 14, 2022",
  }];

	return (
		<div className="simulations-container">
			<h1>Welcome back {user.name}!</h1>
			<div className="subheading">
				<h2>My Simulations</h2>
        <Button green>
          Add Simulation
        </Button>
			</div>
      <List List={simulationsListArray} />
		</div>
	);
}

export default Simulations;
