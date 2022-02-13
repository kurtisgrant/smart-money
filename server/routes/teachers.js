const router = require('express').Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    const query = "SELECT * FROM teachers";
    
    db.query(query)
      .then(data => res.json(data.rows))
      .catch(e => console.log(e.message))
  });

  return router;
};