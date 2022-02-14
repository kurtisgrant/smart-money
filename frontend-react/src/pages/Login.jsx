import React from 'react';
import Button from '../components/Button';
import './Login.scss'

function Login({ setUser }) {
	return (
		<div className="container">
			<header>
				<h2>Login</h2>
			</header>
			<form action="">
				<label htmlFor="email">Email</label>
				<input id="email" type="text" placeholder="Enter Email" />
				<Button
					green
					onClick={() =>
						setUser({ id: 3, name: 'Mrs. Krabappel', type: 'teacher' })
					}
				>
					Login
				</Button>
				<p>(Just click login to login as Mrs. K)</p>
			</form>
		</div>
	);
}

export default Login;
