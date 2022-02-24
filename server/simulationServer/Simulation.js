const dbHelpersConstructor = require('../db/dbHelpers');
const { fancyLog, log } = require('../helpers/fancyLogger');

const INFLATION = 0.02 / 12;
const SAV_INTEREST = 0.015 / 12;
const MONTHLY_SAV_FACTOR = 1 + SAV_INTEREST - INFLATION;
const MONTHLY_CHE_FACTOR = 1 - INFLATION;

const DEBUG_METHOD_LOGS = false;
const TEMP_DEBUG_LOGS = false;

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
    DEBUG_METHOD_LOGS && fancyLog('🔷', ['sync', this.simId], 2);
    const dbH = this.dbHelpers;
    const dbSimRow = await dbH.getTheseFromSimulationById(this.simId, 'is_playing, current_month');
    this.isPlaying = dbSimRow.is_playing;
    this.currentMonth = dbSimRow.current_month;
    await this.setAllStudentData();
    await this.mountStudentSockets();
    await this.mountTeacherSockets();
    return this;
  }

  // Emit updates to all connected sockets
  // on this simulation, sending only what 
  // is required by each. (Sends data as it
  // is in this model when method is called)
  async broadcast() {
    DEBUG_METHOD_LOGS && fancyLog('🔈', ['broadcasting for simulation', this.simId], 0, true);
    this.teacherSockets.forEach(teacherSocket => {
      const teacherUpdate = {
        isPlaying: this.isPlaying,
        currentMonth: this.currentMonth,
        studentData: parseStuDataForTeacher(this.students)
      };
      DEBUG_METHOD_LOGS && fancyLog('↳', `${teacherSocket.user.name} has a connected socket. Emiting update for month ${this.currentMonth}.`, 2);
      teacherSocket.emit('CTRL_PANEL_UPDATE', teacherUpdate);
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
        DEBUG_METHOD_LOGS && fancyLog('↳', `${student.name} has a connected socket. Emiting update for month ${this.currentMonth}.`, 2);
        student.socket.emit('STUDENT_DASH_UPDATE', studentUpdate);
      }
    });
  }

  // Update with new month and student 
  // balances/transactions then
  // persist them to the database
  async update() {
    DEBUG_METHOD_LOGS && fancyLog('🔷', ['update', this.simId], 2);
    const dbH = this.dbHelpers;


    this.currentMonth++;

    // If next month has no marketData, don't update.
    if (!this.marketData.find(d => d.x === this.currentMonth)) {
      await dbH.toggleIsPlaying(this.simId);

      fancyLog('🟥', `SIMULATION ${this.simId} COMPLETE`);
      return;
    }

    await dbH.setCurrentMonth(this.simId, this.currentMonth);

    const curStockPrice = this.marketData.find(dataPoint => dataPoint.x === this.currentMonth).y;

    const stuIds = Object.keys(this.students);

    const stuDbPromises = [];
    for (const stuId of stuIds) {
      const stu = this.students[stuId];

      const stocksToBuy = Math.floor(toDollars(stu.invAllocation) / curStockPrice);
      const newTotalStocks = sumStocks(stu.marketTransactions) + stocksToBuy;

      if (stocksToBuy) {
        stuDbPromises.push(dbH.submitMarketTransaction(stuId, stocksToBuy));
      }
      const dollarValOfTotalStocks = newTotalStocks * curStockPrice;

      stu.inv = toCents(dollarValOfTotalStocks);

      stu.che = Math.round(stu.che * MONTHLY_CHE_FACTOR);
      stu.sav = Math.round(stu.sav * MONTHLY_SAV_FACTOR);

      const leftoverInvAllocationDollars = toDollars(stu.invAllocation) - stocksToBuy * curStockPrice;
      stu.sav += toCents(leftoverInvAllocationDollars);
      stu.sav += stu.savAllocation;
      const cheAllocation = stu.income - stu.expense - stu.invAllocation - stu.savAllocation;
      stu.che += cheAllocation;

      stuDbPromises.push(dbH.setAccountBalances(stu.stuId, stu.che, stu.sav, stu.inv));
      TEMP_DEBUG_LOGS && fancyLog('🔺', `Setting account balances for: ${stu.name}`, 1);
      TEMP_DEBUG_LOGS && fancyLog('↳', `Che: ${toDollars(stu.che)}, Sav: ${toDollars(stu.sav)}, Inv: ${toDollars(stu.inv)}`, 2);
    }
    await Promise.all(stuDbPromises);
  }


  // Get count of sockets currently in
  // teacher & student 'rooms' for this
  // simulation
  async getConnectedCount() {
    DEBUG_METHOD_LOGS && fancyLog('🔷', ['getConnectedCount', this.simId], 2);
    const studentSimRoom = 's-' + this.simKey;
    const studentSockets = await io.in(studentSimRoom).fetchSockets();
    const teacherSimRoom = 't-' + this.simKey;
    const teacherSockets = await io.in(teacherSimRoom).fetchSockets();
    const stuCount = studentSockets.length || 0;
    const teaCount = teacherSockets.length || 0;
    const count = stuCount + teaCount;
    DEBUG_METHOD_LOGS && fancyLog('↳', `${count} connected sockets for simulation ${this.simId}`);
  }

  // Get all students, their accounts 
  // and their market transactions from
  // the database and store them 
  // in this.students
  async setAllStudentData() {
    DEBUG_METHOD_LOGS && fancyLog('🔷', ['setAllStudentData', this.simId], 2);
    const dbH = this.dbHelpers;
    const dbStudentsAndAccounts = await dbH.getStudentsAndAccounts(this.simId);
    const newStudentsObj = {};

    // Loop through students, adding their individual market transactions to each
    for (let i = 0; i < dbStudentsAndAccounts.length; i++) {
      const student = dbStudentsAndAccounts[i];
      student.che = Number(student.che);
      student.sav = Number(student.sav);
      student.inv = Number(student.inv);
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
    DEBUG_METHOD_LOGS && fancyLog('🔷', ['mountStudentSockets', this.simId], 2);
    const io = this.io;
    const studentSimRoom = 's-' + this.simKey;
    const studentSocketsForThisSim = await io.in(studentSimRoom).fetchSockets();
    if (!studentSocketsForThisSim.length) return;
    for (const socket of studentSocketsForThisSim) {
      const stuId = socket.user.id;
      this.students[stuId].socket = socket;
    }
    DEBUG_METHOD_LOGS && fancyLog('↳', `mounted ${studentSocketsForThisSim.length} student sockets`, 3);
  }

  // Get connected teacher socket(s)
  // for this simulation and put them
  // in this.teacherSockets array
  async mountTeacherSockets() {
    DEBUG_METHOD_LOGS && fancyLog('🔷', ['mountTeacherSockets', this.simId], 2);
    const io = this.io;
    const teacherSimRoom = 't-' + this.simKey;
    const teacherSocketsForThisSim = await io.in(teacherSimRoom).fetchSockets();
    this.teacherSockets = [];
    if (!teacherSocketsForThisSim.length) return;
    for (const socket of teacherSocketsForThisSim) {
      this.teacherSockets.push(socket);
    }
    DEBUG_METHOD_LOGS && fancyLog('↳', `mounted ${teacherSocketsForThisSim.length} teacher sockets`, 3);
  }

}

function parseStuDataForTeacher(students) {
  const dataForTeacher = Object.values(students).map(stu => {
    const { name, stuId, che, sav, inv, accessCode: stuAccCode } = stu;
    return { name, stuId, che, sav, inv, stuAccCode };
  });
  return dataForTeacher;
}
function sumStocks(transactions) {
  let sum = 0;
  for (const t of transactions) {
    sum += t.quantity;
  }
  return sum;
}
function toCents(dollars) {
  return Math.round(dollars * 100);
}
function toDollars(cents) {
  return Number((cents / 100).toFixed(2));
}

module.exports = Simulation;