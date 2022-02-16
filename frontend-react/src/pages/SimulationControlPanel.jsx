import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import LineChart from '../components/LineChart';
import StudentListBalance from '../components/StudentListBalance';
import Button from '../components/Button';
import './SimulationControlPanel.scss';

function SimulationControlPanel() {
	const { simulationKey } = useParams();
	const { user } = useContext(UserContext);

	return (
		<div className="simulation-control-panel-container">
			<div className="simulation-control-panel">
				<LineChart />
				<div className="simulation-run-buttons">
					<Button green>Play</Button>
					<Button white>Pause</Button>
				</div>
			</div>
			<div className="simulation-control-panel-student-list">
				<div className="list-heading">
					<h2>Students</h2>
				</div>
				<StudentListBalance />
			</div>
		</div>
	);
}

export default SimulationControlPanel;
