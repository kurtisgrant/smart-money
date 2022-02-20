import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { SocketContext } from '../SocketContext';
import LineChart from '../components/LineChart';
import StudentListBalance from '../components/StudentListBalance';
import CopyClipboard from '../components/CopyClipboard';
import Button from '../components/Button';
import axios from 'axios';
import './SimulationControlPanel.scss';

function SimulationControlPanel() {
	const { simulationKey } = useParams();
	const { user } = useContext(UserContext);
	const { socket } = useContext(SocketContext);
	const [marketData, setMarketData] = useState([]);
	const [currentMonth, setCurrentMonth] = useState(0);
	const [studentData, setStudentData] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [studentsBalance, setStudentsBalance] = useState([]);

	useEffect(() => {
		// GET REQUEST HAPPENS HERE
		axios
			.get(`/api/students/list/${simulationKey}`)
			.then((res) => {
				console.log(res.data)
				setStudentsBalance(res.data);
			})
			.catch((err) => console.log(err.message));

		axios
			.get(`/api/simulations/marketdata/${simulationKey}`)
			.then((res) => {
				setMarketData(JSON.parse(res.data[0].mock_market_data));
			});
	}, []);

	const studentsBalanceList = studentsBalance.map(student => {
		const { stuId: id, stuAccCode: studentAccessCode, name, che, sav, inv } = student;

		return (
			<tr key={id} className="student">
				<td>{name} <span className="student-access-code">({studentAccessCode})</span></td>
				<td>${Number(sav).toLocaleString()}</td>
				<td>${Number(inv).toLocaleString()}</td>
				<td>${Number(che).toLocaleString()}</td>
			</tr>
		);
	});

	const playPauseHandler = () => {
		axios.put(`/api/simulations/toggle/${simulationKey}`)
			.then(res => {
				console.log('Clicked play/pause', res);
				setIsPlaying(res.data[0].is_playing);
			});
		console.log('Sent request to toggle play/pause state');
	};

	const updateHandler = (ctrlPanelUpdate) => {
		// Ultimately will receive current month & student data
		// const { current_month: currentMonth, studentData } = ctrlPanelUpdate;
		const { current_month: currentMonth } = ctrlPanelUpdate;

		console.log('CTRL panel update received: ');
		console.log('currentMonth: ', currentMonth);
		// console.log('studentData: ', studentData);
		setCurrentMonth(currentMonth);
		// setStudentData(studentData);
	};

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

		socket.on('CTRL_PANEL_UPDATE', updateHandler);
		socket.emit('REQ_CTRL_PANEL_UPDATE', simulationKey);

		return () => {
			socket.off('CTRL_PANEL_UPDATE', updateHandler);
		};

	}, [socket]);

	return (
		<div className="simulation-control-panel-container">
			<CopyClipboard accessLink={window.location.href} />
			<div className="simulation-control-panel">
				<LineChart marketData={marketData} currentMonth={currentMonth} />
				<div className="simulation-run-buttons">
					{
						isPlaying ?
							<Button white onClick={playPauseHandler}>Pause</Button> :
							<Button green onClick={playPauseHandler}>Play</Button>
					}
				</div>
			</div>
			<div className="simulation-control-panel-student-list">
				<div className="list-heading">
					<h2>Students</h2>
				</div>
				<table className="student-list-balance">
					<tbody>
						<tr>
							<th>Name (Access Code)</th>
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
