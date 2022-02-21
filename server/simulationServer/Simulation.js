const dbHelpersConstructor = require('../db/dbHelpers');
const { fancyLog, log } = require('../helpers/fancyLogger');

// Model for single simulation entity
class Simulation {
  constructor(db, io, dbSim) {
    const dbHelpers = dbHelpersConstructor(db);
    this.db = db;
    this.io = io;
    this.dbHelpers = dbHelpers;
    this.isPlaying = dbSim.is_playing;
    this.currentMonth = dbSim.current_month;
    this.simId = dbSim.id;
    this.simKey = dbSim.simulation_key;
    this.teacherId = dbSim.teacher_id;
    this.teacherSockets = [];
    this.marketData = JSON.parse(dbSim.mock_market_data);
  }

  // Get most recent values for this
  // simulation from the database
  async sync() {
    fancyLog('🔷', ['init', this.simId], 2);
    const dbH = this.dbHelpers;
    const dbSimRow = await dbH.getTheseFromSimulationById(this.simId, 'is_playing, current_month');
    this.isPlaying = dbSimRow.is_playing;
    this.currentMonth = dbSimRow.current_month;
    await this.setAllStudentData();
    await this.mountStudentSockets();
    await this.mountTeacherSockets();
  }

  // Emit updates to all connected sockets
  // on this simulation, sending only what 
  // is required by each. (Sends data as it
  // is in this model when method is called)
  async broadcast() {
    fancyLog('🔈', ['broadcasting for simulation', this.simId], 0, true);
    this.teacherSockets.forEach(teacherSocket => {
      const teacherUpdate = {
        isPlaying: this.isPlaying,
        currentMonth: this.currentMonth,
        studentData: null
      };
      if (teacherSocket) {
        fancyLog('↳', `${teacherSocket.user.name} has a connected socket. Emiting update for month ${this.currentMonth}.`, 2);
        teacherSocket.emit('CTRL_PANEL_UPDATE', teacherUpdate);
      }
    });
    Object.values(this.students).forEach(student => {
      const studentMarketData = this.marketData.filter(dataPoint => dataPoint.x <= this.currentMonth);
      const studentUpdate = {
        isPlaying: this.isPlaying,
        marketData: studentMarketData,
        income: student.income,
        expense: student.expense,
        che: student.che,
        sav: student.sav,
        inv: student.inv,
        marketTransactions: student.marketTransactions
      };
      if (student.socket) {
        fancyLog('↳', `${student.name} has a connected socket. Emiting update for month ${this.currentMonth}.`, 2);
        student.socket.emit('STUDENT_DASH_UPDATE', studentUpdate);
      }
    });
  }

  update() {
    fancyLog('🔷', ['update', this.simId], 2);
    this.currentMonth++;
  }

  async persist() {
    fancyLog('🔷', ['persist', this.simId], 2);
    const dbH = this.dbHelpers;
    await dbH.setCurrentMonth(this.simId, this.currentMonth);
  }


  // Get count of sockets currently in
  // teacher & student 'rooms' for this
  // simulation
  async getConnectedCount() {
    fancyLog('🔷', ['getConnectedCount', this.simId], 2);
    const studentSimRoom = 's-' + this.simKey;
    const studentSockets = await io.in(studentSimRoom).fetchSockets();
    const teacherSimRoom = 't-' + this.simKey;
    const teacherSockets = await io.in(teacherSimRoom).fetchSockets();
    const stuCount = studentSockets.length || 0;
    const teaCount = teacherSockets.length || 0;
    const count = stuCount + teaCount;
    fancyLog('↳', `${count} connected sockets for simulation ${this.simId}`);
  }

  // Get all students, their accounts 
  // and their market transactions from
  // the database and store them 
  // in this.students
  async setAllStudentData() {
    fancyLog('🔷', ['setAllStudentData', this.simId], 2);
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
  }

  // Loop through connected student sockets
  // for this simulation, adding them to their
  // respective 'student' object in the
  // Simulation model (this.students[id].socket)
  async mountStudentSockets() {
    fancyLog('🔷', ['mountStudentSockets', this.simId], 2);
    const io = this.io;
    const studentSimRoom = 's-' + this.simKey;
    const studentSocketsForThisSim = await io.in(studentSimRoom).fetchSockets();
    if (!studentSocketsForThisSim.length) return;
    for (const socket of studentSocketsForThisSim) {
      const stuId = socket.user.id;
      this.students[stuId].socket = socket;
    }
    fancyLog('↳', `mounted ${studentSocketsForThisSim.length} student sockets`, 3);
  }

  // Get connected teacher socket(s)
  // for this simulation and put them
  // in this.teacherSockets array
  async mountTeacherSockets() {
    fancyLog('🔷', ['mountTeacherSockets', this.simId], 2);
    const io = this.io;
    const teacherSimRoom = 't-' + this.simKey;
    const teacherSocketsForThisSim = await io.in(teacherSimRoom).fetchSockets();
    this.teacherSockets = [];
    if (!teacherSocketsForThisSim.length) return;
    for (const socket of teacherSocketsForThisSim) {
      this.teacherSockets.push(socket);
    }
    fancyLog('↳', `mounted ${teacherSocketsForThisSim.length} teacher sockets`, 3);
  }

}

module.exports = Simulation;