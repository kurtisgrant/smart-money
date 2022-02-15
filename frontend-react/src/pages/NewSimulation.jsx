import React from 'react'
import { useLocation } from 'react-router-dom';
import LineChart from '../components/LineChart'
import Studentlist from '../components/StudentList';

function NewSimulation() {
  const { state } = useLocation();
  console.log(state);
  return (
    <div>New Simulation {state.className}
      <LineChart />
      <Studentlist />
    </div>
  )
}

export default NewSimulation;