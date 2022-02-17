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

	//return JSON with student object OR null if not found
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
	router.get('/list/:simulationId', (req, res) => {
		const { simulationId } = req.params;
		const query = `
      SELECT id, name, access_code AS accessCode FROM students
      WHERE simulation_id = $1
      `;

		db.query(query, [simulationId])
			.then((data) => res.json(data.rows))
			.catch((e) => console.log(e.message));
	});

	return router;
};
