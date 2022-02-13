import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ appState }) {
  return (
    <div style={{ display: 'flex' }}>
      <h1>Navbar</h1>
      <p>Logged in as {appState.user ? appState.user.name : 'null'}</p>
    </div>
  );
}

export default Navbar;