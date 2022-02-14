import React from 'react';
import './Navbar.scss';
import Button from './Button';

function Navbar({ appState, logout }) {
	return (
		<div className="navbar">
			<div className="logo">
				<h1>Logo</h1>
			</div>
			<div className="auth-user">
				<div className="user-name">
					<div>{appState.user ? appState.user.name : null}</div>
				</div>
				<Button white onClick={() => logout()}>Logout</Button>
			</div>
		</div>
	);
}

export default Navbar;
