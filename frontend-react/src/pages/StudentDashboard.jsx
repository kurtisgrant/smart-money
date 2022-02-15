import React, { useContext } from 'react';
import { useParams } from 'react-router-dom'
import { UserContext } from '../UserContext';

function StudentDashboard() {
  const { simulationKey } = useParams();
  const { user } = useContext(UserContext);

  return (
    <div>StudentDashboard</div>
  );
}

export default StudentDashboard;