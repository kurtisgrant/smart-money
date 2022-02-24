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
import MonthPriceIndicator from '../components/MonthPriceIndicator';

function SimulationControlPanel() {
	const { simulationKey } = useParams();
	const { user } = useContext(UserContext);
	const { socket } = useContext(SocketContext);
	const [marketData, setMarketData] = useState([]);
	const [currentMonth, setCurrentMonth] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [studentsBalance, setStudentsBalance] = useState([]);
	const [simulationName, setSimulationName] = useState('');


	useEffect(() => {
		axios
			.get(`/api/simulations/marketdata/${simulationKey}`)
			.then((res) => {
				console.log('=====================', res.data)
				setMarketData(JSON.parse(res.data[0].mock_market_data))
				setSimulationName(res.data[0].name);
			})
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

	const studentsBalanceList = studentsBalance.map(student => {
		const { stuId: id, stuAccCode: studentAccessCode, name, che, sav, inv } = student;

		return (
			<tr key={id} className="student">
				<td><b>{name}</b> <span className="student-access-code">({studentAccessCode})</span></td>
				<td>${Number(sav / 100).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
				<td>${Number(inv / 100).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
				<td>${Number(che / 100).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
				<td><b>${Number((sav + inv + che) / 100).toLocaleString(undefined, {maximumFractionDigits: 0})}</b></td>
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
			<div className="simulation-control-panel-name">
				<h2>{simulationName}</h2>
			</div>
			<CopyClipboard accessLink={window.location.href} />
			<div className="simulation-control-panel">
				<LineChart marketData={marketData} currentMonth={currentMonth} />
				<div className="below-chart-container">
					<MonthPriceIndicator marketData={marketData} currentMonth={currentMonth} />
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
							<th>Name</th>
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
