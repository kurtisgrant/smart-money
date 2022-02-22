const { log, fancyLog } = require('../helpers/fancyLogger');

// These helper functions operate under the assumption that they
// won't be used unless the request is valid & authenticated.
// (They simply do as they're told, ensure authentication etc. before use)
const dbHelpers = (db) => {
  return {

    // Get simulation & teacher by id
    getSimulationById: (simId) => {
      return db.query(`SELECT * FROM simulations WHERE id = ${simId}`).then(data => data.rows[0]);
    },

    // Get specified column values from simulation
    getTheseFromSimulationById: (simId, colsStr) => {
      return db.query(`SELECT ${colsStr} FROM simulations WHERE id = ${simId}`).then(data => data.rows[0]);
    },

    // Get simulation & teacher by key
    getSimulationByKey: (simKey) => {
      return db.query(`SELECT * FROM simulations WHERE simulation_key = '${simKey}'`).then(data => data.rows[0]);
    },

    // Get simulation key by simulation id
    getSimulationKey: (simId) => {
      return db.query(`SELECT simulation_key FROM simulations WHERE id = ${simId}`).then(data => data.rows[0]?.simulation_key);
    },

    // Get simulation id by simulation key
    getSimulationId: (simKey) => {
      return db.query(`SELECT id FROM simulations WHERE simulation_key = '${simKey}'`).then(data => data.rows[0]?.id);
    },

    // Get teacher for simulation by simulation id
    getTeacherForSimulation: (simId) => {
      return db.query(`SELECT teachers.* FROM simulations JOIN teachers ON teachers.id = simulations.teacher_id WHERE simulations.id = ${simId}`).then(data => data.rows[0]);
    },

    // Get all running simulations (teacher joined)
    getRunningSimulations: () => {
      return db.query('SELECT * FROM simulations JOIN teachers ON simulations.teacher_id = teachers.id WHERE is_playing = TRUE').then(data => data.rows);
    },

    // Toggle play/pause state of simulation by simulation id
    toggleIsPlaying: (simId) => {
      return db.query('UPDATE simulations SET is_playing = NOT is_playing WHERE id = $1::INTEGER RETURNING id, name, simulation_key, current_month, is_playing, teacher_id', [simId]).then(data => data.rows[0]);
    },

    setCurrentMonth: (simId, month) => {
      return db.query(`UPDATE simulations SET current_month = ${month} WHERE id = ${simId} RETURNING id, name, simulation_key, current_month, is_playing, teacher_id`).then(data => data.rows[0]);
    },

    getStudentsAndAccounts: (simulationId) => {
      const query = `
			SELECT simulations.id AS sim_id, students.name, students.access_code, students.income, students.expense, students.savings_allocation, students.investment_allocation, accounts.*
			FROM accounts
			JOIN students ON students.id = accounts.student_id
			JOIN simulations ON simulations.id = students.simulation_id
			WHERE simulations.id = $1`;

      return db.query(query, [simulationId])
        .then(data => {
          let stuData = {};

          for (const row of data.rows) {
            const {
              student_id: stuId,
              name,
              access_code: accessCode,
              id: accountId,
              income,
              expense,
              savings_allocation: savAllocation,
              investment_allocation: invAllocation,
              account_type: acntType,
              balance: bal
            } = row;

            const acntTypeAbv = acntType.slice(0, 3).toLowerCase();
            if (!stuData[stuId]) {
              stuData[stuId] = { stuId, name, accessCode, income, expense, savAllocation, invAllocation };
              stuData[stuId][acntTypeAbv] = bal;
              stuData[stuId][acntTypeAbv + 'Id'] = accountId;
            } else {
              stuData[stuId][acntTypeAbv] = bal;
              stuData[stuId][acntTypeAbv + 'Id'] = accountId;
            }
          }

          stuData = Object.values(stuData);
          return stuData;
        })
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
      `;

      return db.query(query, [studentId])
        .then((data) => data.rows)
        .catch((e) => console.log(e.message));
    },

    // Performs multiple database queries to set balances for each account
    setAccountBalances: (studentId, cheBal, savBal, invBal) => {

      const query = `
      UPDATE accounts SET balance = CASE
        WHEN account_type = 'Chequing' then $2::BIGINT
        WHEN account_type = 'Savings' then $3::BIGINT
        WHEN account_type = 'Investment' then $4::BIGINT
        end
      WHERE student_id = $1
      RETURNING *
      `;

      return db.query(query, [studentId, cheBal, savBal, invBal])
        .then((data) => data.rows)
        .catch((e) => console.log(e.message));
    },

    submitMarketTransaction: (studentId, quantity) => {

      const queryAccountId = `
        SELECT accounts.id, simulations.current_month, simulations.mock_market_data
        FROM accounts
        JOIN students ON students.id = accounts.student_id
        JOIN simulations ON simulations.id = students.simulation_id
        WHERE students.id = $1 AND accounts.account_type = 'Investment'
      `;

      const querySubmitTrans = `
        INSERT INTO market_transactions (price, quantity, account_id)
        VALUES ($1::BIGINT, $2, $3)
        RETURNING *
      `;

      return db.query(queryAccountId, [studentId])
        .then((data) => {
          const { id: accountId, current_month: currentMonth, mock_market_data: jsonMarketData } = data.rows[0];
          const marketData = JSON.parse(jsonMarketData);
          const marketDataPoint = marketData.find(row => row.x === currentMonth);
          const price = Math.round(marketDataPoint?.y * 100);

          return db.query(querySubmitTrans, [price, quantity, accountId])
            .then((data) => data.rows);
        })
        .catch((e) => console.log(e.message));
    },

    updateMonthlyAllocations: (studentId, savings, investments) => {
      const query = `
			UPDATE students
			SET savings_allocation = $1,
					investment_allocation = $2
			WHERE id = $3
		`;

      return db.query(query, [savings, investments, studentId])
        .then((data) => data.rows)
        .catch((e) => console.log(e.message));
    },

    getStudentAccountBalance: (studentId) => {
      const query = `
			SELECT accounts.*
			FROM accounts
			JOIN students ON students.id = accounts.student_id
			WHERE students.id = $1`;

      return db.query(query, [studentId])
        .then((data) => data.rows)
        .catch((e) => console.log(e.message));
    }
  };
};

module.exports = dbHelpers;