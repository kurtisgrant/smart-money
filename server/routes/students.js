const router = require('express').Router();
const dbHelpers = require('../db/dbHelpers');

module.exports = (db) => {
	const { updateMonthlyAllocations, getStudentAccountBalance } = dbHelpers(db);

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

		db.query(query, [inputOne, inputTwo, id])
			.then(() => res.send(`Student id: ${id} created`))
			.catch((err) => res.status(500));
	});

	// delete student
	router.delete('/:id', (req, res) => {
		const { id } = req.params;

		const query = `
      DELETE FROM students
      WHERE id = $1`;

		db.query(query, [id])
			.then(() => res.send(`Student id: ${id} deleted`))
			.catch((err) => res.status(500));
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
			SELECT simulations.id AS sim_id, students.name, students.access_code, accounts.*
			FROM accounts
			JOIN students ON students.id = accounts.student_id
			JOIN simulations ON simulations.id = students.simulation_id
			WHERE simulations.id = (SELECT id FROM simulations WHERE simulation_key = $1)
    `;
		db.query(query, [simulationKey])
			.then(data => {
				let stuData = {};

				for (const row of data.rows) {
					const { 
						student_id: stuId,
						access_code: stuAccCode,
						account_type: acntType,
						balance: bal, name,
					} = row;

					if (!stuData[stuId]) {
						stuData[stuId] = { stuId, name, stuAccCode };
						stuData[stuId][acntType.slice(0, 3).toLowerCase()] = (bal / 100).toFixed(2);
					} else {
						stuData[stuId][acntType.slice(0, 3).toLowerCase()] = (bal / 100).toFixed(2);
					}
				}
				 
				stuData = Object.values(stuData);

				return stuData;
			})
			.then((data) => res.json(data))
			.catch((e) => console.log(e.message));
	});

	// update monthly saving and investment allocations
	router.put('/allocations/:studentId', (req, res) => {
		const { studentId } = req.params;
		const { savings, investments } = req.body;

		updateMonthlyAllocations(studentId, toCents(savings), toCents(investments))
			.then(() => {
				res.json((`Monthly allocation updated for student id: ${studentId}`));
			})
			.catch(e => console.log(e.message));
	});

	// get current student account balance
	router.get(`/accountbalance/:studentId`, (req, res) => {
		const { studentId } = req.params;

		getStudentAccountBalance(studentId)
			.then((data) => {
				const accountBalance = {};
				let totalBalance = 0;

				for (const row of data) {
					accountBalance[row.account_type.toLowerCase()] = (row.balance / 100).toFixed(2);

					totalBalance += Number((row.balance / 100).toFixed(2));
				}

				accountBalance.total = totalBalance.toString();

				res.json(accountBalance)
			})
			.catch(e => console.log(e.message));
	})


	return router;
};

function toCents(dollars) {
	return Math.round(dollars * 100);
}
function toDollars(cents) {
	return Number((cents / 100).toFixed(2));
}
