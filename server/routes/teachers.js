const router = require('express').Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    const query = "SELECT * FROM teachers";
    
    db.query(query)
      .then(data => res.json(data.rows))
      .catch(e => console.log(e.message))
  });

  //return JSON of teacher object OR null if not found
  router.post('/api/teacher/login', (req, res) => {
    const email = req.body.email;
    const query = "SELECT * FROM teachers WHERE email = $1", [email];
    db.query(query)
      .then(data => {
        console.log(data.rows)
        res.json(data.rows)
      }) 
      .catch(e => console.log(e.message))
  })

  return router;
};