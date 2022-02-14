import React, { useState } from 'react';
import './Form.scss';

function Form({ label, id, placeholder, inputValue, setValue, handleSubmit }) {
	return (
		<form className="login-form" autoComplete="off" onSubmit={handleSubmit}>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				type="text"
				placeholder={placeholder}
				value={inputValue}
				onChange={(e) => setValue(e.target.value)}
			/>
		</form>
	);
}

export default Form;