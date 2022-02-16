const router = require('express').Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    const query = "SELECT * FROM students";
    
    db.query(query)
      .then(data => res.json(data.rows))
      .catch(e => console.log(e.message))
  });

  //return JSON with student object OR null if not found
  router.post('/login', (req, res) => {
    const accessCode = req.body.accessCode;
    const query = "SELECT * FROM students WHERE access_code = $1";

    db.query(query, [accessCode])
      .then(data => {
        let user = data.rows[0];

        user.type = 'student';
        res.json(user);
      })
      .catch(e => console.log(e.message))
  })

  return router;
};
