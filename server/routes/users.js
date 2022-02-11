const router = require('express').Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    const command = "SELECT * FROM teachers";
    
    db.query(command)
      .then(data => res.json(data.rows))
      .catch(e => console.log(e.message))
  });

  return router;
};