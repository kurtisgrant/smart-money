import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import generateMockMarketData from '../helpers/generateMockMarketData';
import generateRandomString from '../helpers/generateRandomString';
import LineChart from '../components/LineChart';
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
	let navigate = useNavigate();

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

	const handleAddStudent = (e) => {
		e.key === 'Enter' && addStudent();
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
		} else if (!studentExpense) {
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

			// POST REQUEST HAPPENS HERE
			axios
				.post('/api/simulations', simulationInfo)
				.then(() => {
					// redirect to the next page upon successful post request
					navigate(`/sim/${simulationKey}`, { replace: true });
				})
				.catch((err) => console.log(err.message));

			setSimulationName('');
			setStudentIncome('');
			setStudentExpense('');
			setStudents([]);
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
					<h4>Monthly Cashflow</h4>
					<SingleFieldForm
						label="Income ($)"
						id="student-income"
						placeholder="Set student income"
						inputValue={studentIncome}
						setValue={setStudentIncome}
					/>
					<SingleFieldForm
						label="Expense ($)"
						id="student-expense"
						placeholder="Set student expense"
						inputValue={studentExpense}
						setValue={setStudentExpense}
					/>
				</div>
				<div className="simulation-view-right">
					{randomMarketData.length && (
						<LineChart marketData={randomMarketData} currentMonth={0} />
					)}
					<div className="simulation-buttons">
						<Button green onClick={randomizeMarketData}>
							Randomize
						</Button>
					</div>
				</div>
			</div>

			<div className="simulation-students">
				<div className="simulation-student-list">
					<div className="simulations-form-heading">
						<h2>Students</h2>
						<Button green onClick={saveSimulation}>
							Save Simulation
						</Button>
					</div>
				</div>
				<div className="add-student">
					<input
						value={newStudentName}
						onChange={(e) => setNewStudentName(e.target.value)}
						placeholder="Student name"
						onKeyPress={handleAddStudent}
					/>
					<Button green onClick={addStudent}>
						Add Student
					</Button>
				</div>
				{students.length > 0 ? (
					<StudentList studentsList={students} onDelete={deleteStudent} />
				) : (
					<div className="student-empty">Add students to create a new simulation</div>
				)}
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
		months: 721, // How many months of data do you want?
	}).map((val, i) => {
		return { x: i - 120, y: val };
	});
};

export default NewSimulation;
