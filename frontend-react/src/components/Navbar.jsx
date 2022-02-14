import React from 'react';
import './Navbar.scss';
import Button from './Button';

function Navbar({ appState, logout }) {

	const authUserDiv = <div className="auth-user">
		<div className="user-name">
			<div>{appState.user?.name}</div>
		</div>
		<Button white onClick={() => logout()}>Logout</Button>
	</div>;

	return (
		<div className="navbar">
			<div className="logo">
				<h1>Logo</h1>
			</div>
			{appState.user && authUserDiv}
		</div>
	);
}

export default Navbar;
