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
		axios
			.get(`/api/simulations/marketdata/${simulationKey}`)
			.then((res) => setMarketData(JSON.parse(res.data[0].mock_market_data)))
			.catch((err) => console.log(err.message));

		// Socket stuff
		socket.on('PLAY_PAUSE_UPDATE', updateIsPlayingHandler);
		socket.on('CTRL_PANEL_UPDATE', updateHandler);
		socket.emit('JOIN_SIMULATION', simulationKey, user);

		return () => {
			socket.emit('LEAVE_SIMULATION', simulationKey);
			socket.off('PLAY_PAUSE_UPDATE', updateIsPlayingHandler);
			socket.off('CTRL_PANEL_UPDATE', updateHandler);
		};
	}, []);
	console.log(studentsBalance)
	const studentsBalanceList = studentsBalance.map(student => {
		const { stuId: id, stuAccCode: studentAccessCode, name, che, sav, inv } = student;

		return (
			<tr key={id} className="student">
				<td>{name} <span className="student-access-code">({studentAccessCode})</span></td>
				<td>${Number(sav / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
				<td>${Number(inv / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
				<td>${Number(che / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
				<td>${Number((sav + inv + che) / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
			</tr>
		);
	});

	const playPauseHandler = () => {
		socket.emit('PLAY_PAUSE_SIMULATION', simulationKey);

		console.log('Sent request to toggle play/pause state');
	};
	const updateIsPlayingHandler = (newIsPlaying) => setIsPlaying(newIsPlaying);

	const updateHandler = (ctrlPanelUpdate) => {
		// Ultimately will receive current month & student data
		// const { current_month: currentMonth, studentData } = ctrlPanelUpdate;
		const { currentMonth, isPlaying, studentData } = ctrlPanelUpdate;

		console.log('CTRL panel update received: ');
		console.log('currentMonth: ', currentMonth);
		console.log('studentData: ', studentData);
		console.log('isPlaying: ', isPlaying);
		setStudentsBalance(studentData);
		setCurrentMonth(currentMonth);
		setIsPlaying(isPlaying);
	};

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
							<th>Saving</th>
							<th>Investment</th>
							<th>Chequing</th>
							<th>Total</th>
						</tr>
						{studentsBalanceList}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default SimulationControlPanel;
