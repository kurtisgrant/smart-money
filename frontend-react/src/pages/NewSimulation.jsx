import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
import generateMockMarketData from '../helpers/generateMockMarketData';
import GraphWithPlayhead from '../components/GraphWithPlayhead';
import StudentList from '../components/StudentList';
import SingleFieldForm from '../components/SingleFieldForm';
import Button from '../components/Button';
import AddForm from '../components/AddForm';
import './NewSimulation.scss';

function NewSimulation() {
	const [randomMarketData, setRandomMarketData] = useState([]);
	const [studentsList, setStudentsList] = useState([]);
	const [studentName, setStudentName] = useState('');
	const [accessCode, setAccessCode] = useState('');
	// const { state } = useLocation();

	const randomizeMarketData = () => {
		const data = getRandomMarketData();
		setRandomMarketData(data);
	};
	useEffect(() => {
		randomizeMarketData();
	}, []);

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

	if (!randomMarketData.length) return null;

	return (
		<div className="simulation-container">
			<div className="simulation-view">
				<div className="simulation-view-left">
					<h2>New Simulation</h2>
					<SingleFieldForm
						label="Simulation Name"
						id="class-name"
						placeholder="Simulation Name"
					// inputValue={state?.className}
					/>
				</div>
				<div className="simulation-view-right">
					<GraphWithPlayhead marketData={randomMarketData} currentMonth={0} zeroIndex={10 * 12} />
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

const getRandomMarketData = () => {
	return generateMockMarketData({
		firstYearSeed: 1950, // Min: 1871
		lastYearSeed: 2015, // Max: 2018
		adjustForInflation: true, // true: Adjust to Today's dollars, false: Allow inflation
		startPrice: 10, // First price in fake market data
		months: 720, // How many months of data do you want?
	});
};

export default NewSimulation;
