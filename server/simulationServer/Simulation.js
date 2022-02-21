const dbHelpersConstructor = require('../db/dbHelpers');


class Simulation {
  constructor(db, io, dbSim) {
    const dbHelpers = dbHelpersConstructor(db);
    this.db = db;
    this.io = io;
    this.dbHelpers = dbHelpers;
    this.simId = dbSim.id;
    this.simKey = dbSim.simulation_key;
    this.teacherId = dbSim.teacher_id;
    this.marketData = dbSim.mock_market_data;
  }

  // This method gets all students, their
  // accounts and their market transactions
  // and stores them in this.students
  async setAllStudentData() {
    const dbH = this.dbHelpers;
    const dbStudentsAndAccounts = await dbH.getStudentsAndAccounts(this.simId);
    const newStudentsObj = {};
    dbStudentsAndAccounts.forEach(async student => {
      const studentMarketTransactions = await dbH.getMarketTransactionsForStudent(student.stuId);
      student.marketTransactions = studentMarketTransactions;
      newStudentsObj[student.stuId] = student;
    });
    this.students = newStudentsObj;
    return;
  }

}

module.exports = Simulation;