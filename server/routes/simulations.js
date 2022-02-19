const router = require('express').Router();

module.exports = (db) => {
	// show list of all simulations
	router.get('/', (req, res) => {
		const query = 'SELECT * FROM simulations';

		db.query(query)
			.then((data) => res.json(data.rows))
			.catch((e) => console.log(e.message));
	});

	// create new simulation
	router.post('/', (req, res) => {
		console.log('newsimulation post');
		console.log({ requestBody: req.body, students: req.body.students });
		let {
			simulationName,
			simulationKey,
			studentIncome,
			studentExpense,
			randomMarketData,
			teacherId,
			students,
		} = req.body;
		
		console.log('LINE 27', randomMarketData);
		// convert dollars to cents
		studentIncome *= 100;
		studentExpense *= 100;

		console.log('LINE 32');
		// insert simulation info to simulations table
		const querySimulations = `
    INSERT INTO simulations(name, simulation_key, mock_market_data, income, expense, teacher_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `;

		console.log('LINE 40');


		const studentsBalanceData = (simulationId) => students.map((student) => {
				const queryStudents = `
					INSERT INTO students(name, access_code, simulation_id)
					VALUES ($1, $2, $3)
					RETURNING *
				`;

				return db
					.query(queryStudents, [
						student.name,
						student.accessCode,
						simulationId,
					])
					.then((res) => {
						console.log('LINE 68');
						const student = res.rows[0];
						const chequingsValue = studentIncome - studentExpense;

						const insertAccounts = `
							INSERT INTO accounts(account_type, balance, student_id)
							VALUES ('Savings', $1, $2), ('Investments', $3, $2), ('Chequings', $4, $2)
							RETURNING *
						`;

						return db
							.query(insertAccounts, [0, student.id, 0, chequingsValue])
							.then((res) => {
								console.log('promise resolved 1 res =>', res.rows[0]);
								return res.rows[0];
								// resolve()
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
			.then((response) => {
				console.log('LINE 50');
				const simulationId = response.rows[0].id;
				// studentsBalanceData(simulationId)

				res.send(studentsBalanceData(simulationId));
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
			.then(() => {
				res.send(`${id} deleted`)
			})
			.catch((err) => res.status(500))
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
			SELECT income, expense FROM simulations
			WHERE simulation_key = $1
			`;

		db.query(query, [simulationKey])
			.then((data) => res.json(data.rows))
			.catch((e) => console.log(e.message));
	});

	return router;
};

// const testingAsync = async () => {
// 	const myValue = await db.query('blah )')

// 	return myValue
// }

// const testingAsyncWithPromise = () => {
// 	const myValue = Promise.resolve(db.query('blah )'))

// 	return myValue
// }
