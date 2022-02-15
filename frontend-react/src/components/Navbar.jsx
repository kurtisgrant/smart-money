import React, { useContext } from 'react';
import './Navbar.scss';
import { UserContext } from '../UserContext';
import Button from './Button';

function Navbar({ appState, logout }) {
	const { user, setUser } = useContext(UserContext);

	const authUserDiv = <div className="auth-user">
		<div className="user-name">
			<div>{user?.name}</div>
		</div>
		<Button white onClick={() => setUser(null)}>Logout</Button>
	</div>;

	return (
		<div className="navbar">
			<div className="logo">
				<h1>Logo</h1>
			</div>
			{user && authUserDiv}
		</div>
	);
}

export default Navbar;
