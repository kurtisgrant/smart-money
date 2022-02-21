import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import SingleFieldForm from '../components/SingleFieldForm';
import Button from '../components/Button';
import axios from 'axios';
import './Login.scss';

function Login() {
	const { user, setUser } = useContext(UserContext);
	const [email, setEmail] = useState('');
	const [error, setError] = useState("");

	const login = () => {
		const userInfo = { email };

		axios
			.post('/api/teachers/login', userInfo)
			.then((res) => {
				const user = res.data;

				setUser(user);
			})
			.catch((err) => console.log(err.message));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		login() || setError('Incorrect email');
	};

	return (
		<div className="login-container">
			<h1>Login</h1>
			<SingleFieldForm
				label="Email"
				id="email"
				placeholder="Enter email"
				inputValue={email}
				setValue={setEmail}
				handleSubmit={handleSubmit}
			/>
			<section className="login-error">{error}</section>
			<Button green onClick={handleSubmit}>
				Login
			</Button>
		</div>
	);
}

export default Login;
