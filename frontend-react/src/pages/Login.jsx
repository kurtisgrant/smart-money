import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import SingleFieldForm from '../components/SingleFieldForm';
import Button from '../components/Button';
import axios from 'axios';
import './Login.scss';

function Login() {
	const { setUser } = useContext(UserContext);
	const [email, setEmail] = useState('');

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
		login();
	}

	return (
		<div className="login-container">
			<h2>Login</h2>
			<SingleFieldForm
				label="Email"
				id="email"
				placeholder="Enter email"
				inputValue={email}
				setValue={setEmail}
				handleSubmit={handleSubmit}
			/>
			<Button green onClick={login}>
				Login
			</Button>
		</div>
	);
}

export default Login;
