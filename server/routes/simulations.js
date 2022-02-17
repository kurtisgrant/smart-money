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
		console.log(req.body);
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

		db.query(querySimulations, [
			simulationName,
			simulationKey,
			randomMarketData,
			studentIncome,
			studentExpense,
			teacherId,
		])
			.then((res) => {
				const simulationId = res.rows[0].id;

				for (const student of students) {
					const queryStudents = `
            INSERT INTO students(name, access_code, simulation_id)
            VALUES ($1, $2, $3)
          `;

					db.query(queryStudents, [
						student.name,
						student.accessCode,
						simulationId,
					]);
				}
			})
			.catch((err) => console.log(err.message));
	});

	// delete simulation
	router.delete('/:id', (req, res) => {
		const { id } = req.params;

		const query = `
    DELETE FROM simulations
    WHERE id = $1`;

		db.query(query, [id]);
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

	return router;
};
