import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import LineChart from '../components/LineChart';
import StudentList from '../components/StudentList';
import SingleFieldForm from '../components/SingleFieldForm';
import Button from '../components/Button';
import AddForm from '../components/AddForm';
import './NewSimulation.scss';

function NewSimulation() {
	const [studentsList, setStudentsList] = useState([]);
	const [studentName, setStudentName] = useState('');
	const [accessCode, setAccessCode] = useState('');
	const { state } = useLocation();

	const onSubmit = (e) => {
		e.preventDefault();

		if (!studentName || !accessCode) {
			return alert('Please fill out both student name and access code.');
		}

		setStudentsList((prev) => [
			...prev,
			{ id: studentsList.length + 1, name: studentName, accessCode },
		]);

		setStudentName('');
		setAccessCode('');
	};

	const deleteStudent = (id) => {
		setStudentsList(
			studentsList.filter((studentItem) => studentItem.id !== id)
		);
	};

	return (
		<div className="simulation-container">
			<div className="simulation-view">
				<div className="simulation-view-left">
					<h2>New Simulation</h2>
					<SingleFieldForm
						label="Class Name"
						id="class-name"
						inputValue={state.className}
					/>
				</div>
				<div className="simulation-view-right">
					<LineChart />
					<div className="simulation-buttons">
						<Button green>Randomize</Button>
						<Button white>Confirm</Button>
					</div>
				</div>
			</div>

			<div className="simulation-student-list">
				<div className="simulations-form-heading">
					<h2>Students</h2>
					<Button green>Add Students</Button>
				</div>
				<AddForm
					onSubmit={onSubmit}
					inputOnePlaceholder="Enter student name"
					inputOneValue={studentName}
					setInputOne={setStudentName}
					inputTwoPlaceholder="Enter access code"
					inputTwoValue={accessCode}
					setInputTwo={setAccessCode}
				/>

				<StudentList studentsList={studentsList} onDelete={deleteStudent} />
			</div>
		</div>
	);
}

export default NewSimulation;
