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
	const [studentsBalance, setStudentsBalance] = useState([]);

	useEffect(() => {
		// GET REQUEST HAPPENS HERE
			axios
				.get(`http://localhost:8080/api/students/list/${simulationKey}`)
				.then((res) => {
					console.log('Students returned from axios req: ', res.data);
	
					setStudentsBalance(res.data);
				})
				.catch((err) => console.log(err.message));

	}, []);

	useEffect(() => {
		console.log(studentsBalance);
	}, [studentsBalance]);

	const studentsBalanceList = studentsBalance.map(student => {
		const { stuId: id, name, che, sav, inv } = student;
		return (
			<tr key={id} className="student">
				<td>{name}</td>
				<td>${sav}</td>
				<td>${inv}</td>
				<td>${che}</td>
			</tr>
		);
	});

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
						{studentsBalanceList}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default SimulationControlPanel;
