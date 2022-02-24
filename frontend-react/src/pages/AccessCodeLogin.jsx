import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import SingleFieldForm from '../components/SingleFieldForm';
import Button from '../components/Button';
import axios from 'axios';
import './AccessCodeLogin.scss';

function AccessCodeLogin() {
	const { setUser } = useContext(UserContext);
	const [accessCode, setAccessCode] = useState('');
	const [error, setError] = useState('');

	const login = () => {
		const userInfo = { accessCode };

		axios
			.post('/api/students/login', userInfo)
			.then((res) => {
				const user = res.data;

				setUser(user);
			});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		login() || setError('Incorrect access code');
	}

	return (
		<div className="login-container-student">
			<h1>Enter Access Code</h1>
			<div className="login-student-form">
				<SingleFieldForm
					label="Access Code"
					id="access-code"
					placeholder="Enter access code"
					inputValue={accessCode}
					setValue={setAccessCode}
					handleSubmit={handleSubmit}
				/>
			</div>
			{/* <section className="login-error">{error}</section> */}
			<Button green onClick={handleSubmit}>
				Enter
			</Button>
		</div>
	);
}

export default AccessCodeLogin;
