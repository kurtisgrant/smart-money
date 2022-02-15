import React from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

function Simulations({ user }) {
  return (
    <div>
      <p>Welcome back {user.name}!</p>
      <h1>My Simulations</h1>
      <Link to='/new'><Button green>New Simulation</Button></Link>
      <p>Simulations list will go here</p>
    </div>
  );
}

export default Simulations;