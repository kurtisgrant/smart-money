import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom';
import generateMockMarketData from '../helpers/generateMockMarketData';
import generateRandomString from '../helpers/generateRandomString';
import GraphWithPlayhead from '../components/GraphWithPlayhead';
import StudentList from '../components/StudentList';
import SingleFieldForm from '../components/SingleFieldForm';
import Button from '../components/Button';
import axios from 'axios';
import './NewSimulation.scss';

function NewSimulation() {
	const { user } = useContext(UserContext);
	const [randomMarketData, setRandomMarketData] = useState([]);
	const [students, setStudents] = useState([]);
	const [studentIncome, setStudentIncome] = useState('');
	const [studentExpense, setStudentExpense] = useState('');
	const [newStudentName, setNewStudentName] = useState('');
	const [simulationName, setSimulationName] = useState('');

	const simulationKey = generateRandomString(6);

	const randomizeMarketData = () => {
		const data = getRandomMarketData();
		setRandomMarketData(data);
	};

	useEffect(() => {
		randomizeMarketData();
	}, []);

	const addStudent = () => {
		if (!newStudentName) return alert('Student name cannot be empty.');

		setStudents([
			...students,
			{ name: newStudentName, accessCode: generateRandomString(5) },
		]);
		setNewStudentName('');
	};

	const deleteStudent = (accessCode) => {
		setStudents(students.filter((stu) => stu.accessCode !== accessCode));
	};

	const saveSimulation = (e) => {
		if (students.length === 0) {
			e.preventDefault();
			return alert('At least one student is needed.');
		} else if (!simulationName) {
			e.preventDefault();
			return alert('Simulation name cannot be empty.');
		} else if (!studentIncome) {
			e.preventDefault();
			return alert('Student income cannot be empty.');
		}	else if (!studentExpense) {
			e.preventDefault();
			return alert('Student expense cannot be empty.');
		} else {
			const teacherId = user.id;
			const simulationInfo = {
				simulationName,
				simulationKey,
				studentIncome,
				studentExpense,
				randomMarketData,
				teacherId,
				students,
			};

		axios.post('/api/simulations', simulationInfo);

			setSimulationName('');
			setStudentIncome('');
			setStudentExpense('');
		}
	};

	if (!randomMarketData.length) return null;

	return (
		<div className="simulation-container">
			<div className="simulation-view">
				<div className="simulation-view-left">
					<h2>New Simulation</h2>
					<SingleFieldForm
						label="Simulation Name"
						id="simulation-name"
						placeholder="Enter simulation name"
						inputValue={simulationName}
						setValue={setSimulationName}
					/>
					<SingleFieldForm
						label="Student Income ($)"
						id="student-income"
						placeholder="Set student income"
						inputValue={studentIncome}
						setValue={setStudentIncome}
					/>
					<SingleFieldForm
						label="Student Expense ($)"
						id="student-expense"
						placeholder="Set student expense"
						inputValue={studentExpense}
						setValue={setStudentExpense}
					/>
				</div>
				<div className="simulation-view-right">
					<GraphWithPlayhead
						marketData={randomMarketData}
						currentMonth={0}
						zeroIndex={10 * 12}
					/>
					<div className="simulation-buttons">
						<Button green onClick={randomizeMarketData}>Randomize</Button>
					</div>
				</div>
			</div>

			<div className="simulation-student-list">
				<div className="simulations-form-heading">
					<h2>Students</h2>
					<Link to={`/sim/${simulationKey}`}>
						<Button green onClick={saveSimulation}>
							Save Simulation
						</Button>
					</Link>
				</div>
			</div>
			<div className="add-student">
				<input
					value={newStudentName}
					onChange={(e) => setNewStudentName(e.target.value)}
					placeholder="Student name"
				/>
				<Button green onClick={addStudent}>Add Student</Button>
			</div>
			<StudentList studentsList={students} onDelete={deleteStudent} />
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
