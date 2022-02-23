const router = require('express').Router();
const dbHelpers = require('../db/dbHelpers');

module.exports = (db) => {
	const { toggleIsPlaying } = dbHelpers(db);

	// show list of all simulations
	router.get('/', (req, res) => {
		const query = 'SELECT * FROM simulations';

		db.query(query)
			.then((data) => res.json(data.rows))
			.catch((e) => console.log(e.message));
	});

	// create new simulation
	router.post('/', (req, res) => {
		let {
			simulationName,
			simulationKey,
			studentIncome,
			studentExpense,
			randomMarketData,
			teacherId,
			students,
		} = req.body;

		// convert dollars to cents
		studentIncome *= 100;
		studentExpense *= 100;

		// insert simulation info to simulations table
		const querySimulations = `
    INSERT INTO simulations(name, simulation_key, mock_market_data, income, expense, teacher_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `;

		// function for inserting students and accounts data
		const studentsBalanceData = (simulationId, income, expense) =>
			students.map((student) => {
				const queryStudents = `
					INSERT INTO students(name, income, expense, access_code, simulation_id)
					VALUES ($1, $2, $3, $4, $5)
					RETURNING *
				`;

				return db
					.query(queryStudents, [
						student.name,
						income,
						expense,
						student.accessCode,
						simulationId,
					])
					.then((res) => {
						const student = res.rows[0];
						const chequingsValue = studentIncome - studentExpense;

						const insertAccounts = `
							INSERT INTO accounts(account_type, balance, student_id)
							VALUES ('Savings', $1, $2), ('Investment', $3, $2), ('Chequing', $4, $2)
							RETURNING *
						`;

						return db
							.query(insertAccounts, [0, student.id, 0, chequingsValue])
							.then((res) => {
								return res.rows[0];
							});
					});
			});

		return db
			.query(querySimulations, [
				simulationName,
				simulationKey,
				JSON.stringify(randomMarketData),
				studentIncome,
				studentExpense,
				teacherId,
			])
			.then((data) => {
				const simulationId = data.rows[0].id;
				const income = data.rows[0].income;
				const expense = data.rows[0].expense;

				res.send(studentsBalanceData(simulationId, income, expense));
			})
			.catch((err) => console.log(err.message));
	});

	// delete simulation
	router.delete('/:id', (req, res) => {
		const { id } = req.params;

		const query = `
    DELETE FROM simulations
    WHERE id = $1`;

		db.query(query, [id])
			.then(() => res.send(`Simulation id: ${id} deleted`))
			.catch((err) => res.status(500));
	});

	// show list of simulations for specific teacher
	router.get('/list/:teacherId', (req, res) => {
		const { teacherId } = req.params;

		const query = `
    SELECT id, name, created_date AS date, simulation_key FROM simulations
    WHERE teacher_id = $1
    `;

		db.query(query, [teacherId])
			.then((data) => res.json(data.rows))
			.catch((e) => console.log(e.message));
	});

	// return income and expense monthly cashflow for specific simulation
	router.get('/cashflow/:simulationKey', (req, res) => {
		const { simulationKey } = req.params;

		const query = `
			SELECT simulations.income, simulations.expense, simulations.name, teachers.name AS teacherName
			FROM simulations
			JOIN teachers ON teachers.id = simulations.teacher_id
			WHERE simulation_key = $1
			`;

		db.query(query, [simulationKey])
			.then((data) => res.json(data.rows))
			.catch((e) => console.log(e.message));
	});

	// return market data created from new simulation
	router.get('/marketdata/:simulationKey', (req, res) => {
		const { simulationKey } = req.params;

		const query = `
			SELECT mock_market_data, name FROM simulations
			WHERE simulation_key = $1
		`;

		db.query(query, [simulationKey])
			.then((data) => res.json(data.rows))
			.catch((e) => console.log(e.message));
	});

	router.put('/toggle/:simulationKey', (req, res) => {
		const { simulationKey } = req.params;

		toggleIsPlaying(simulationKey)
			.then((data) => {
				res.json(data);
			})
			.catch(e => console.log(e.message));

	});

	return router;
};
