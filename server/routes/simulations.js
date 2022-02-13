const router = require('express').Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    const query = "SELECT * FROM simulations";
    
    db.query(query)
      .then(data => {
        const mock_data = data.rows[0].mock_market_data;

        res.json(JSON.parse(mock_data));
      })
      .catch(e => console.log(e.message))
  });

  return router;
};