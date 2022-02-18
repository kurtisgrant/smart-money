import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { SocketContext } from '../SocketContext';
import LineChart from '../components/LineChart';
import StudentListBalance from '../components/StudentListBalance';
import Button from '../components/Button';
import './SimulationControlPanel.scss';

function SimulationControlPanel() {
	const { simulationKey } = useParams();
	const { user } = useContext(UserContext);
	const { socket } = useContext(SocketContext);
	const [marketData, setMarketData] = useState([]);
	const [studentData, setStudentData] = useState([]);
	const [currentMonth, setCurrentMonth] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	const playPauseHandler = () => {
		socket.emit('TOGGLE_ISPLAYING');
		console.log('Sent request to toggle play/pause state');
	};

	const updateHandler = (ctrlPanelUpdate) => {
		const { isPlaying, currentMonth, studentData } = ctrlPanelUpdate;
		console.log('CTRL panel update received: ');
		console.log('isPlaying: ', isPlaying);
		console.log('currentMonth: ', currentMonth);
		console.log('studentData: ', studentData);
		// setIsPlaying(isPlaying);
		// setCurrentMonth(currentMonth);
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
				<StudentListBalance studentData={studentData} />
			</div>
		</div>
	);
}

export default SimulationControlPanel;
