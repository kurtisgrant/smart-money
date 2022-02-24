import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import { UserContext } from '../UserContext';
import Button from './Button';
const Logo = require('./docs/logo.png');

function Navbar({ appState, logout }) {
	const { user, setUser } = useContext(UserContext);

	const authUserDiv = (
		<div className="auth-user">
			<div className="user-name">
				<div>{user?.name}</div>
			</div>
			<Button white onClick={() => setUser(null)}>
				Logout
			</Button>
		</div>
	);

	return (
		<div className="navbar">
			<div className="logo">
				<Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
					<img src={Logo} alt="logo" className="logo-image" />
				</Link>
					<div className="app-name">SmartMoney</div>
			</div>
			{user && authUserDiv}
		</div>
	);
}

export default Navbar;
