import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { SocketContext } from '../SocketContext';
import LineChartStudent from '../components/LineChartStudent';
import MonthPriceIndicator from '../components/MonthPriceIndicator';
import './StudentDashboard.scss';
import axios from 'axios';

function StudentDashboard() {
	const { simulationKey } = useParams();
	const { user } = useContext(UserContext);
	const { socket } = useContext(SocketContext);
	const [marketData, setMarketData] = useState([]);
	const [income, setIncome] = useState(0);
	const [expense, setExpense] = useState(0);
	const [surplus, setSurplus] = useState(0);
	const [savings, setSavings] = useState(0);
	const [investments, setInvestments] = useState(0);
	const [chequings, setChequings] = useState(0);
	const [accountBalance, setAccountBalance] = useState({});
	const [simulationName, setSimulationName] = useState('');
	const [teacherName, setTeacherName] = useState('');
	const currentMonth = marketData[marketData.length - 1]?.x;
	
	const updateHandler = (studentData) => {

		console.log(studentData);
		const { sav, inv, che, marketData } = studentData;
		
		setAccountBalance({
			sav: sav / 100,
			inv: inv / 100,
			che: che / 100,
			total: (sav + inv + che) / 100
		});

		setMarketData(marketData);
	};

	useEffect(() => {
		if(!socket) return;

		axios
			.get(`/api/simulations/cashflow/${simulationKey}`)
			.then((res) => {
				const incomeData = Number(res.data[0].income) / 100;
				const expenseData = Number(res.data[0].expense) / 100;
				const surplusData = incomeData - expenseData;
				console.log(res)

				setIncome(incomeData);
				setExpense(expenseData);
				setSurplus(surplusData);
				setChequings(surplusData);
				setSimulationName(res.data[0].name);
				setTeacherName(res.data[0].teachername);
			})
			.catch((err) => console.log(err.message));

		socket.on('STUDENT_DASH_UPDATE', updateHandler);
		socket.emit('REQ_STUDENT_DASH_UPDATE', user);

		return () => {
			socket.off('STUDENT_DASH_UPDATE', updateHandler);
		};

	}, [socket]);

	useEffect(() => {
		setChequings(surplus - savings - investments);

		const studentId = user.id;

		const monthlyAllocations = { savings, investments };

		axios
			.put(`/api/students/allocations/${studentId}`, monthlyAllocations)
			.catch((err) => console.log(err.message));

	}, [savings, investments, surplus]);

	const decreaseSavingsAmount = () => {
		if (savings > 0) {
			setSavings(savings - 50);
		}
	};

	const increaseSavingsAmount = () => {
		if (savings + 50 + investments > surplus) {
			return;
		}

		setSavings(savings + 50);
	};

	const decreaseInvestmentsAmount = () => {
		if (investments > 0) {
			setInvestments(investments - 50);
		}
	};

	const increaseInvestmentsAmount = () => {
		if (investments + 50 + savings > surplus) {
			return;
		}

		setInvestments(investments + 50);
	};

	useEffect(() => {
		if (!socket) return;
		/*
		 * TODO: emit event indicating that
		 * I'm a student of X simulation
		 * and I would like to be notified
		 * of changes to my own account
		 * balances and changes to the market
		 * price (by way of new market data
		 * arrays) when the simulation is running.
		 */
	}, [socket]);

	return (
		<div className="dashboard-container">
			<div className="dashboard-greeting">
				<h2>{`Welcome to ${teacherName}'s ${simulationName}`}</h2>
			</div>
			<div className="dashboard-top">
				<div className="dashboard-top-left">
					<h3>Monthly Cashflow</h3>
					<div className="cashflow">
						<span className="col-1">Income</span>
						<span className="col-2">${income.toLocaleString()} / m</span>
					</div>
					<div className="cashflow">
						<span className="col-1">Expense</span>
						<span className="col-2">${expense.toLocaleString()} / m</span>
					</div>
					<div className="cashflow">
						<span className="col-1-green">Surplus</span>
						<span className="col-2">${surplus.toLocaleString()} / m</span>
					</div>
				</div>
				<div className="dashboard-top-right">
					<LineChartStudent marketData={marketData} />
					<MonthPriceIndicator marketData={marketData} currentMonth={currentMonth} />
				</div>
			</div>
			<div className="dashboard-bottom">
				<div className="dashboard-bottom-left">
					<div className="dashboard-bottom-left-allocations">
						<h3>Monthly Allocations</h3>
						<div className="allocation">
							<span className="col-1">Saving</span>
							<span className="col-2" onClick={decreaseSavingsAmount}>
								-
							</span>
							<span className="col-3">${savings.toLocaleString()}</span>
							<span className="col-4" onClick={increaseSavingsAmount}>
								+
							</span>
						</div>
						<div className="allocation">
							<span className="col-1">Investment</span>
							<span className="col-2" onClick={decreaseInvestmentsAmount}>
								-
							</span>
							<span className="col-3">${investments.toLocaleString()}</span>
							<span className="col-4" onClick={increaseInvestmentsAmount}>
								+
							</span>
						</div>
						<div className="allocation chequings">
							<span className="col-1">Chequing</span>
							<span className="col-2"></span>
							<span className="col-3">${chequings.toLocaleString()}</span>
							<span className="col-4"></span>
						</div>
					</div>
				</div>
				<div className="dashboard-bottom-right">
					<div className="dashboard-bottom-right-account-balance">
						<h3>My Account Balance</h3>
						<div className="account-balance">
							<span className="col-1">Saving</span>
							<span className="col-2">${Number(accountBalance.sav).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
						</div>
						<div className="account-balance">
							<span className="col-1">Investment</span>
							<span className="col-2">${Number(accountBalance.inv).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
						</div>
						<div className="account-balance">
							<span className="col-1">Chequing</span>
							<span className="col-2">${Number(accountBalance.che).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
						</div>
						<div className="account-balance">
							<span className="col-1-green">Total</span>
							<span className="col-2">${Number(accountBalance.total).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StudentDashboard;
