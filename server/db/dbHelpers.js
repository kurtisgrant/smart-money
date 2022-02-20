
// These helper functions operate under the assumption that they
// won't be used unless the request is valid & authenticated.
// (They simply do as they're told, ensure authentication etc. before use)
const dbHelpers = (db) => {
  return {

    // Get all running simulations (teacher joined)
    getRunningSimulations: () => {
      return db.query('SELECT * FROM simulations JOIN teachers ON simulations.teacher_id = teachers.id WHERE is_playing = TRUE').then(data => data.rows);
    },

    // Toggle play/pause state of simulation by simulation id
    toggleIsPlaying: (simulationKey) => {
      return db.query('UPDATE simulations SET is_playing = NOT is_playing WHERE simulation_key = $1 RETURNING id, name, simulation_key, is_playing, teacher_id', [simulationKey]).then(data => data.rows);
    },

    getStudentsAndAccounts: (simulationId) => {
      const query = `
			SELECT simulations.id AS sim_id, students.name, accounts.*
			FROM accounts
			JOIN students ON students.id = accounts.student_id
			JOIN simulations ON simulations.id = students.simulation_id
			WHERE simulations.id = $1`;

      db.query(query, [simulationId])
        .then(data => {
          let stuData = {};

          for (const row of data.rows) {
            const { student_id: stuId, account_type: acntType, balance: bal, name } = row;
            if (!stuData[stuId]) {
              stuData[stuId] = { stuId, name };
              stuData[stuId][acntType.slice(0, 3).toLowerCase()] = (bal / 100).toFixed(2);
            } else {
              stuData[stuId][acntType.slice(0, 3).toLowerCase()] = (bal / 100).toFixed(2);
            }
          }

          stuData = Object.values(stuData);
          console.log('Sending data for request to "/list/:simulationKey": ', stuData);
          return stuData;
        })
        .then((data) => res.json(data))
        .catch((e) => console.log(e.message));

      // Returns array with following structure:
      // [
      //   { student_id, name, accountBalances: { che: 0, sav: 0, inv: 0 }, allocations: { sav: 0, inv: 0 }, income, expense }
      // ];
    },
    
    // Return array with following structure:
    // [{ id, price, quantity, account_id }];
    getMarketTransactionsForStudent: (studentId) => {
      const query = `
      SELECT students.id AS student_id, market_transactions.price, market_transactions.quantity, market_transactions.account_id
      FROM students
      JOIN accounts ON accounts.student_id = students.id
      JOIN market_transactions ON market_transactions.account_id = accounts.id
      WHERE students.id = $1
      `

      return db.query(query, [studentId])
        .then((data) => data.rows)
        .catch((e) => console.log(e.message));
    },

    // Performs multiple database queries to set balances for each account
    setAccountBalances: (studentId, cheBal, savBal, invBal) => {
      console.log(typeof studentId, typeof cheBal, typeof savBal, typeof invBal)
      //
      const query = `
      UPDATE accounts SET balance = CASE
        WHEN account_type = 'Chequing' then $2
        WHEN account_type = 'Savings' then $3
        WHEN account_type = 'Investment' then 3000
        end
      WHERE student_id = $1
      RETURNING *
      `

      return db.query(query, [studentId, cheBal, savBal])
        .then((data) => data.rows)
        .catch((e) => console.log(e.message));

      // !!!DOES NOT WORK WHEN $4 IS ADDED!!! WHY????
      // const query = `
      // UPDATE accounts SET balance = CASE
      //   WHEN account_type = 'Chequing' then $2
      //   WHEN account_type = 'Savings' then $3
      //   WHEN account_type = 'Investment' then $4
      //   end
      // WHERE student_id = $1
      // RETURNING *
      // `

      // return db.query(query, [studentId, cheBal, savBal, invBal])
      //   .then((data) => data.rows)
      //   .catch((e) => console.log(e.message));
    },

    submitMarketTransaction: (studentId, quantity) => {
      const accountType = 'Investment';

      const queryAccountId = `
        SELECT accounts.id
        FROM accounts
        JOIN students ON students.id = accounts.student_id
        WHERE students.id = $1 AND accounts.account_type = $2
      `

      const querySubmitTrans = `
        INSERT INTO market_transactions (price, quantity, account_id)
        VALUES (100, $1, $2);
      `

      return db.query(queryAccountId, [studentId, accountType])
        .then((data) => {
          const accountId = data.rows[0].id;

          // data is being inserted but data.rows is empty
          // i think we need to pass in price as parameter as well?
          return db.query(querySubmitTrans, [quantity, accountId])
            .then((data) => data.rows)
        })
        .catch((e) => console.log(e.message))


    }
  };
};

module.exports = dbHelpers;