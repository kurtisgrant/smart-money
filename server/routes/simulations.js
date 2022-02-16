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
  })

  return router;
};