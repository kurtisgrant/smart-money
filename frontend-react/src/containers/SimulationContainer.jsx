import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SimulationControlPanel from '../pages/SimulationControlPanel';
import StudentDashboard from '../pages/StudentDashboard';
import AccessCodeLogin from '../pages/AccessCodeLogin';

// TODO: Function sends ajax request for simulation data
const getSimulation = (simulationKey) => {
  const dataFromServer = { simulationName: 'Class 4M97', teacherName: 'Mrs. Krabappel', teacherId: '3', studentIds: [4, 6, 8, 9] };
  return new Promise((resolve) => setTimeout(() => resolve(dataFromServer), Math.random() * 3000));
};

function SimulationContainer({ user, setUser }) {
  const [simulationData, setSimulationData] = useState(undefined);
  const { simulation_key } = useParams();

  // Get simulation data using simulation key from url parameter
  useEffect(() => {
    getSimulation(simulation_key)
      .then(data => setSimulationData(data));
  }, [simulation_key]);

  if (simulationData === undefined) return <div>Loading...</div>;
  if (simulationData === null) return <div>404: Not Found</div>;

  if (simulationData && !user) return <AccessCodeLogin setUser={setUser} simulationKey={simulation_key} />;

  if (user.id === simulationData.teacherId && user.type === 'teacher') {
    return <SimulationControlPanel simulationKey={simulation_key} />;
  } else if (simulationData.studentIds.includes(user.id) && user.type === 'student') {
    return <StudentDashboard simulationKey={simulation_key} />;
  } else {
    return <div>401: Unauthorized</div>;
  }
}

export default SimulationContainer;