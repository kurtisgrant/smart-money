import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';

function Navbar({ appState }) {
	return (
		// <div style={{ display: 'flex' }}>
		//   <h1>Navbar</h1>
		//   <p>Logged in as {appState.user ? appState.user.name : 'null'}</p>
		// </div>
		<div className="navbar">
			<div className="logo">
				<h1>Logo</h1>
			</div>
			<div className="user-name">
				<div>Mrs. Krabappel</div>
				{/* <div>{appState.user ? appState.user.name : null}</div> */}
			</div>
		</div>
	);
}

export default Navbar;
