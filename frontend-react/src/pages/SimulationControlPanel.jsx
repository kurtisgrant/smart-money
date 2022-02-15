import React, { useContext } from 'react';
import { useParams } from 'react-router-dom'
import { UserContext } from '../UserContext';
import LineChart from '../components/LineChart';
import Studentlist from '../components/StudentList';

function SimulationControlPanel() {
  const { simulationKey } = useParams()
  const { user } = useContext(UserContext);

  return (
    <div>SimulationControlPanel
      {/* <LineChart /> */}
      {/* <Studentlist /> */}
    </div>
  );
}

export default SimulationControlPanel;