import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { SocketContext } from '../SocketContext';
import LineChart from '../components/LineChart';
import StudentListBalance from '../components/StudentListBalance';
import Button from '../components/Button';
import axios from 'axios';
import './SimulationControlPanel.scss';

function SimulationControlPanel() {
	const { simulationKey } = useParams();
	const { user } = useContext(UserContext);
	const { socket } = useContext(SocketContext);
	const [marketData, setMarketData] = useState([]);
	const [currentMonth, setCurrentMonth] = useState(0);

	useEffect(() => {
		axios
			.get(`http://localhost:8080/api/students/list/${simulationKey}`)
			.then((res) => {
				console.log(res.data);
			});
	}, []);

	useEffect(() => {
		if (!socket) return;
		/*
		 * TODO: emit event indicating that
		 * I'm the teacher of X simulation
		 * and I would like to be notified
		 * of all related student account
		 * values and the current point in
		 * the simulation as it is updated
		 */
	}, [socket]);

	return (
		<div className="simulation-control-panel-container">
			<div className="simulation-control-panel">
				<LineChart marketData={marketData} currentMonth={currentMonth} />
				<div className="simulation-run-buttons">
					<Button green>Play</Button>
					<Button white>Pause</Button>
				</div>
			</div>
			<div className="simulation-control-panel-student-list">
				<div className="list-heading">
					<h2>Students</h2>
				</div>
				<table className="student-list-balance">
					<tbody>
						<tr>
							<th>Name</th>
							<th>Savings</th>
							<th>Investments</th>
							<th>Chequings</th>
						</tr>
						<tr className="student">
							<th>John Doe</th>
							<td>$1,000</td>
							<td>$500</td>
							<td>$500</td>
						</tr>
						<tr className="student">
							<th>Adam Johns</th>
							<td>$900</td>
							<td>$300</td>
							<td>$800</td>
						</tr>
						<tr className="student">
							<th>Sam Lee</th>
							<td>$500</td>
							<td>$500</td>
							<td>$1,000</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default SimulationControlPanel;
