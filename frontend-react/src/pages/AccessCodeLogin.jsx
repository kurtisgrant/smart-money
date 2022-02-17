import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import SingleFieldForm from '../components/SingleFieldForm';
import Button from '../components/Button';
import axios from 'axios';
import './AccessCodeLogin.scss';

function AccessCodeLogin() {
	const { setUser } = useContext(UserContext);
	const [accessCode, setAccessCode] = useState('');

	const login = () => {
		const userInfo = { accessCode };

		axios
			.post('http://localhost:5000/api/students/login', userInfo)
			.then((res) => {
				const user = res.data;

				setUser(user);
			});

	};
	return (
		<div className="login-container-student">
			<h2>Welcome to Mrs. Krabappel's</h2>
			<h2>Class 4M97</h2>
			<h3>Enter Access Code</h3>
			<div className="login-student-form">
				<SingleFieldForm
					label="Access Code"
					id="access-code"
					placeholder="Enter access code"
					inputValue={accessCode}
					setValue={setAccessCode}
				/>
			</div>
			<Button green onClick={login}>
				Enter
			</Button>
		</div>
	);
}

export default AccessCodeLogin;
