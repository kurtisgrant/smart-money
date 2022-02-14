import React from 'react';
import Button from '../components/Button';
import './Simulations.scss'

function Simulations({ user }) {
	return (
		<div className="simulations-container">
			<h1>Welcome back {user.name}!</h1>
			<div className="subheading">
				<h2>My Simulations</h2>
        <Button green>
          Add Simulation
        </Button>
			</div>

			<p>Simulations list will go here</p>
		</div>
	);
}

export default Simulations;
