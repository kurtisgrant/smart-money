import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
// import { useLocation } from 'react-router-dom';
import generateMockMarketData from '../helpers/generateMockMarketData';
import generateRandomString from '../helpers/generateRandomString';
import GraphWithPlayhead from '../components/GraphWithPlayhead';
import StudentList from '../components/StudentList';
import SingleFieldForm from '../components/SingleFieldForm';
import Button from '../components/Button';
import AddForm from '../components/AddForm';
import axios from 'axios';
import './NewSimulation.scss';

function NewSimulation() {
	const { user } = useContext(UserContext);
	const [randomMarketData, setRandomMarketData] = useState([]);
	const [className, setClassName] = useState('');
	const [studentsList, setStudentsList] = useState([]);
	const [studentName, setStudentName] = useState('');
	const [accessCode, setAccessCode] = useState(generateRandomString(5));
	// const { state } = useLocation();
	// const { className, simulationId, teacherId } = state;

	const randomizeMarketData = () => {
		const data = getRandomMarketData();
		setRandomMarketData(data);
	};

	useEffect(() => {
		randomizeMarketData();

		// axios
		// 	.get(`/api/students/list/${simulationId}`)
		// 	.then((res) => {
		// 		setStudentsList(res.data);
		// 	});
	}, []);

	const deleteStudent = (id) => {
		// axios.delete(`/api/students/${id}`);
		
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
						label="Class Name"
						id="class-name"
						placeholder="Enter class name"
						inputValue={className}
						setValue={setClassName}
					/>
				</div>
				<div className="simulation-view-right">
					<GraphWithPlayhead
						marketData={randomMarketData}
						currentMonth={0}
						zeroIndex={10 * 12}
					/>
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
					accessCode
					// id={simulationId}
					inputOnePlaceholder="Enter student name"
					inputOneValue={studentName}
					setInputOne={setStudentName}
					inputTwoValue={accessCode}
					setInputTwo={setAccessCode}
					list={studentsList}
					setList={setStudentsList}
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
