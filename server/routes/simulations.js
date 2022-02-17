const router = require('express').Router();

module.exports = (db) => {
  // show list of all simulations
  router.get('/', (req, res) => {
    const query = "SELECT * FROM simulations";

    db.query(query)
      .then(data => res.json(data.rows))
      .catch(e => console.log(e.message));
  });

  // create new simulation
  router.post('/', (req, res) => {
    const { inputOne, inputTwo, id } = req.body;
    const query = `
    INSERT INTO simulations(name, created_date, teacher_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `;

    db.query(query, [inputOne, inputTwo, id]);
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
      .then(data => res.json(data.rows))
      .catch(e => console.log(e.message));
  });

  return router;
};