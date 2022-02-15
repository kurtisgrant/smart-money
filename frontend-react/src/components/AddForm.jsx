import { Fragment, useState } from 'react';
import generateRandomString from '../helpers/generateRandomString';
import Button from './Button';
import './AddForm.scss';

function AddForm({
	date,
	accessCode,
	inputOneValue,
	inputOnePlaceholder,
	inputTwoValue,
	inputTwoPlaceholder,
	list,
	setList
}) {
	const [inputOne, setInputOne] = useState(inputOneValue || '');
	const [inputTwo, setInputTwo] = useState(inputTwoValue || '');

	const onSubmit = (e) => {
    e.preventDefault();

    if (!inputOne || !inputTwo) {
      return alert('Please fill out both fields.');
    }

		if (date) {
			setList((prev) => [
				...prev,
				{ id: list.length + 1, name: inputOne, date: inputTwo },
			]);

			setInputOne('');
			setInputTwo('');
		}

		if (accessCode) {
			setList((prev) => [
				...prev,
				{ id: list.length + 1, name: inputOne, accessCode: inputTwo },
			]);

			setInputOne('');
			setInputTwo(generateRandomString(5));
		}
  };

	return (
		<form className="add-form" onSubmit={onSubmit}>
			<>
				<input
					type="text"
					placeholder={inputOnePlaceholder}
					value={inputOne}
					onChange={(e) => setInputOne(e.target.value)}
				/>
			</>
			<>
				<input
					type="text"
					placeholder={inputTwoPlaceholder}
					value={inputTwo}
					onChange={(e) => setInputTwo(e.target.value)}
				/>
			</>
			<>
				<Button green type="submit">
					Submit
				</Button>
			</>
		</form>
	);
}

export default AddForm;
