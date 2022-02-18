import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { SocketContext } from '../SocketContext';
import './StudentDashboard.scss';
import axios from 'axios';

function StudentDashboard() {
	const { simulationKey } = useParams();
	const { user } = useContext(UserContext);
	const { socket } = useContext(SocketContext);
	const [income, setIncome] = useState(0);
	const [expense, setExpense] = useState(0);
	const [surplus, setSurplus] = useState(0);
	const [savings, setSavings] = useState(0);
	const [investments, setInvestments] = useState(0);
	const [chequings, setChequings] = useState(0);

  useEffect(() => {
    axios
    .get(`http://localhost:8080/api/simulations/cashflow/${simulationKey}`)
    .then((res) => {
      const incomeData = Number(res.data[0].income) / 100;
      const expenseData = Number(res.data[0].expense) / 100;
      const surplusData = incomeData - expenseData

      setIncome(incomeData);
      setExpense(expenseData);
      setSurplus(surplusData);
      setChequings(surplusData);
    })
    .catch((err) => console.log(err.message));
    
  }, [])

  useEffect(() => {
    setChequings(surplus - savings - investments);

  }, [savings, investments, surplus])

	const decreaseSavingsAmount = () => {
		if (savings > 0) {
			setSavings(savings - 50);
		}
	};

	const increaseSavingsAmount = () => {
    if (savings + 50 + investments > surplus) {
      return
    }

    setSavings(savings + 50);
	};

  const decreaseInvestmentsAmount = () => {
    if (investments > 0) {
			setInvestments(investments - 50);
		}
  }

  const increaseInvestmentsAmount = () => {
    if (investments + 50 + savings > surplus) {
      return
    }
    
    setInvestments(investments + 50);
  }

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
			<div className="dashboard-top">
				<div className="dashboard-top-left">
					<h3>Monthly Cashflow</h3>
					<div className="cashflow">
						<span className="col-1">Income</span>
						<span className="col-2">${income.toLocaleString()} / m</span>
					</div>
					<div className="cashflow">
						<span className="col-1">Expenses</span>
						<span className="col-2">${expense.toLocaleString()} / m</span>
					</div>
					<div className="cashflow">
						<span className="col-1-green">Surplus</span>
						<span className="col-2">${surplus.toLocaleString()} / m</span>
					</div>
				</div>
				<div className="dashboard-top-right"></div>
			</div>
			<div className="dashboard-bottom">
				<div className="dashboard-bottom-left">
					<h3>Monthly Allocations</h3>
					<div className="allocation">
						<span className="col-1">Savings</span>
						<span className="col-2" onClick={decreaseSavingsAmount}>
							-
						</span>
						<span className="col-3">${savings.toLocaleString()}</span>
						<span className="col-4" onClick={increaseSavingsAmount}>
							+
						</span>
					</div>
          <div className="allocation">
						<span className="col-1">Investments</span>
						<span className="col-2" onClick={decreaseInvestmentsAmount}>
							-
						</span>
						<span className="col-3">${investments.toLocaleString()}</span>
						<span className="col-4" onClick={increaseInvestmentsAmount}>
							+
						</span>
					</div>
          <div className="allocation chequings">
						<span className="col-1">Chequings</span>
						<span className="col-2"></span>
						<span className="col-3">${chequings.toLocaleString()}</span>
						<span className="col-4"></span>
					</div>
				</div>
				<div className="dashboard-bottom-right"></div>
			</div>
		</div>
	);
}

export default StudentDashboard;
