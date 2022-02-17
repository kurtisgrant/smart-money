import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import LineChart from '../components/LineChart';
import Studentlist from '../components/StudentList';
import { SocketContext } from '../SocketContext';

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
    <div>SimulationControlPanel
      {/* <LineChart /> */}
      {/* <Studentlist /> */}
    </div>
  );
}

export default SimulationControlPanel;