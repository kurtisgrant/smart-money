import React from 'react';
import './SingleFieldForm.scss';

function Form({ label, id, placeholder, inputValue, setValue, handleSubmit, typePassword }) {
	return (
		<form className="single-field-form" autoComplete="off" onSubmit={handleSubmit}>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				type={typePassword || "text"}
				placeholder={placeholder}
				value={inputValue}
				onChange={(e) => setValue(e.target.value)}
			/>
		</form>
	);
}

export default Form;
