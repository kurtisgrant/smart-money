import React, { useState } from 'react';
import Form from '../components/Form';
import Button from '../components/Button';
import './Login.scss';

function Login({ setUser }) {
	const [email, setEmail] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<div className="login-container">
			<h2>Login</h2>
			<Form
				label="Email"
				id="email"
				placeholder="Enter email"
				inputValue={email}
				setValue={setEmail}
				handleSubmit={handleSubmit}
			/>
			<Button
				green
				onClick={() =>
					setUser({ id: 3, name: 'Mrs. Krabappel', type: 'teacher' })
				}
			>
				Login
			</Button>
			<p>(Just click login to login as Mrs. K)</p>
		</div>
	);
}

export default Login;
