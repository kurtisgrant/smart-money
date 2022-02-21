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
    this.students = {};
  }
  async addStudentsAndAccounts() {
    const dbStudentsAndAccounts = await this.dbHelpers.getStudentsAndAccounts(this.simId);
  }

}

module.exports = Simulation;