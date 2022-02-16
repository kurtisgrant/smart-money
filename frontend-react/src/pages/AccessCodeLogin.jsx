import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import SingleFieldForm from '../components/SingleFieldForm';
import Button from '../components/Button';
import './AccessCodeLogin.scss';

function AccessCodeLogin() {
	const { setUser } = useContext(UserContext);
	const [accessCode, setAccessCode] = useState('');

	const handleSubmit = () => {
		setUser({ id: 8, name: 'Johnny Appleseed', type: 'student' });
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
			<Button green onClick={handleSubmit}>
				Enter
			</Button>
		</div>

		// <div>
		//   <h2>Enter Access Code</h2>
		//   <form action="">
		//     <label htmlFor="access-code">Access Code</label>
		//     <input id="access-code" type="text" />
		//     <button onClick={handleSubmit}>Enter</button>
		//     <p>(Just click enter to login as Johnny)</p>
		//   </form>
		// </div>
	);
}

export default AccessCodeLogin;
