import React from 'react';
import Login from '../pages/Login';
import Simulations from '../pages/Simulations';

function IndexContainer({ user, setUser }) {
  if (user && user.type == 'teacher') {
    return <Simulations user={user} />;
  } else {
    return <Login setUser={setUser} />;
  }
}

export default IndexContainer;