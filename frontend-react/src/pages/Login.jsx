import React, { useState }from 'react';
import Button from '../components/Button';
import './Login.scss';

function Login({ setUser }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  }

	return (
		<div className="container">
			<header>
				Login
			</header>
			<form className="login-form" autoComplete="off" onSubmit={handleSubmit}>
				<label htmlFor="email">Email</label>
				<input
					id="email"
					type="text"
					placeholder="Enter Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
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
			</form>
		</div>
	);
}

export default Login;
