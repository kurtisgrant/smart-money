const router = require('express').Router();

module.exports = (db) => {
	router.get('/', (req, res) => {
		const query = 'SELECT * FROM students';

		db.query(query)
			.then((data) => res.json(data.rows))
			.catch((e) => console.log(e.message));
	});

	// create new student
	router.post('/', (req, res) => {
		const { inputOne, inputTwo, id } = req.body;
		const query = `
      INSERT INTO students(name, access_code, simulation_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `;

		db.query(query, [inputOne, inputTwo, id]);
	});

	// delete student
	router.delete('/:id', (req, res) => {
		const { id } = req.params;

		const query = `
      DELETE FROM students
      WHERE id = $1`;

		db.query(query, [id]);
	});

	// return JSON with student object OR null if not found
	router.post('/login', (req, res) => {
		const accessCode = req.body.accessCode;
		const query = 'SELECT * FROM students WHERE access_code = $1';

		db.query(query, [accessCode])
			.then((data) => {
				let user = data.rows[0];

				user.type = 'student';
				res.json(user);
			})
			.catch((e) => console.log(e.message));
	});

	// show list of students for specific simulation
	router.get('/list/:simulationKey', (req, res) => {
		const { simulationKey } = req.params;
		const query = `
			SELECT simulations.id AS sim_id, students.name, accounts.*
			FROM accounts
			JOIN students ON students.id = accounts.student_id
			JOIN simulations ON simulations.id = students.simulation_id
			WHERE simulations.id = (SELECT id FROM simulations WHERE simulation_key = $1)
    `;
		db.query(query, [simulationKey])
			.then(data => {
				let stuData = {};
				for (const row of data.rows) {
					const { student_id: stuId, account_type: acntType, balance: bal, name } = row;
					if (!stuData[stuId]) {
						stuData[stuId] = { stuId, name };
						stuData[stuId][acntType.slice(0, 3).toLowerCase()] = (bal / 100).toFixed(2);
					} else {
						stuData[stuId][acntType.slice(0, 3).toLowerCase()] = (bal / 100).toFixed(2);
					}
				}
				stuData = Object.values(stuData);
				console.log('Sending data for request to "/list/:simulationKey": ', stuData);
				return stuData;
			})
			.then((data) => res.json(data))
			.catch((e) => console.log(e.message));
	});

	return router;
};
