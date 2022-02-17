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
