const router = require('express').Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    const query = "SELECT * FROM simulations";
    
    db.query(query)
    .then(data => res.json(data.rows))
    .catch(e => console.log(e.message))
  });

  router.post('/', (req, res) => {
    const { inputOne, inputTwo, id } = req.body;
    const query = `
    INSERT INTO simulations(name, created_date, teacher_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `

    db.query(query, [inputOne, inputTwo, id])
  });

  router.get('/list/:teacherId', (req, res) => {
    const { teacherId } = req.params;
    console.log('list:', req.params);

    const query = `
    SELECT id, name, created_date AS date FROM simulations
    WHERE teacher_id = $1
    `

    db.query(query, [teacherId])
      .then(data => res.json(data.rows))
      .catch(e => console.log(e.message))
  });

  return router;
};