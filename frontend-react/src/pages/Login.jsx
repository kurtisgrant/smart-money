import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import SingleFieldForm from '../components/SingleFieldForm';
import Button from '../components/Button';
import './Login.scss';

function Login() {
	const { setUser } = useContext(UserContext)
	const [email, setEmail] = useState('');

	return (
		<div className="login-container">
			<h2>Login</h2>
			<SingleFieldForm
				label="Email"
				id="email"
				placeholder="Enter email"
				inputValue={email}
				setValue={setEmail}
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
