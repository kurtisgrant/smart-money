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

    // Loop through students, adding their individual market transactions to each
    for (let i = 0; i < dbStudentsAndAccounts.length; i++) {
      const student = dbStudentsAndAccounts[i];
      const studentMarketTransactions = await dbH.getMarketTransactionsForStudent(student.stuId);
      student.marketTransactions = studentMarketTransactions;
      newStudentsObj[student.stuId] = student;
    }
    this.students = newStudentsObj;
    return;
  }

  async mountStudentSockets() {
    const io = this.io;
    const dbH = this.dbHelpers;
    const studentSimRoom = 's-' + this.simKey;
    const ioSocketsForSim = await io.in(studentSimRoom).fetchSockets();
    if (!ioSocketsForSim.length) return;
    for (const socket of ioSocketsForSim) {
      const stuId = socket.user.id;
      this.students[stuId].socket = socket;
    }
    return;
  }
}

module.exports = Simulation;