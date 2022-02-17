import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { UserContext } from '../UserContext';
import { SocketContext} from '../SocketContext'

function StudentDashboard() {
  const { simulationKey } = useParams();
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;
    /* 
     * TODO: emit event indicating that 
     * I'm a student of X simulation
     * and I would like to be notified 
     * of changes to my own account
     * balances and changes to the market
     * price (by way of new market data 
     * arrays) when the simulation is running.
     */

  }, [socket]);

  return (
    <div>StudentDashboard</div>
  );
}

export default StudentDashboard;