const INTERVAL_SECONDS = 1;
const dbHelpers = require('../db/dbHelpers');
const Simulation = require('./Simulation');


module.exports = (io, db) => {
  const {
    getSimulationId,
    getSimulationById,
    getTeacherForSimulation,
    toggleIsPlaying,
    getRunningSimulations,
    getSimulationKey,
    getMarketTransactionsForStudent
  } = dbHelpers(db);

  // This will hold the interval allowing us to clear(stop) it later
  let serveClientsInterval;
  // Object of simulation models currently loaded into memory
  const loadedSimulations = {};

  io.on('connection', (socket) => {
    console.log('\n🟢  Client connected. socket id: ', socket.id);
    if (!serveClientsInterval) {
      startServingClients();
    }
    socket.on('SET_USER', async (user) => {
      socket.user = user;
      socket.isTeacher = user.type === 'teacher';
      socket.isStudent = user.type === 'student';
      console.log(
        `👤  ${user.name} has been set as the socket user.
        ↳ user obj: `, user);

      if (socket.isStudent) {
        // Students join room for their simulation immediately
        // since they can never join other simulaitons
        const simKey = await getSimulationKey(socket.user.simulation_id);
        const studentSimRoom = 's-' + simKey;
        socket.join(studentSimRoom);
      }
    });

    socket.on('JOIN_SIMULATION', simKey => {
      const teacherSimRoom = 't-' + simKey;
      socket.join(teacherSimRoom);
      console.log(`\n🚪=>  ${socket.user?.name} joined simulation with key: ${simKey}`);
    });

    socket.on('LEAVE_SIMULATION', simKey => {
      const teacherSimRoom = 't-' + simKey;
      socket.leave(teacherSimRoom);
      console.log(`\n🚪<=  ${socket.user?.name} left simulation with key: ${simKey}`);
    });

    socket.on('PLAY_PAUSE_SIMULATION', async (simulationKey) => {
      // Validate request
      const simId = await getSimulationId(simulationKey);
      const teacher = await getTeacherForSimulation(simId);
      if (teacher.id !== socket.user.id || socket.isStudent) return;

      // Toggle isPlaying & send new isPlaying state
      const dbUpdatedRow = await toggleIsPlaying(simId);
      const simWasStarted = dbUpdatedRow.is_playing;
      console.log(`\n⏯  ${socket.user.name} ${simWasStarted ? 'started' : 'paused'} simulation ${simId} (${simulationKey})`);
      socket.emit('PLAY_PAUSE_UPDATE', simWasStarted);

      // If simulation has been started, ensure it is in loadedSimulations
      if (simWasStarted) {
        simulationStartHandler(simId);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(
        `\n❌  ${socket.user?.name} was disconnected. socket id: ${socket.id}
        ↳ reason: ${reason}`);
      updateSocketsCount();
    });

  });

  async function serveSimulationClients() {
    process.stdout.write(".");

    /* 
     * Same here. The serveSimulaitonClients 
     * function will need helper functions
     */

    const runningSimulations = await db
      .query('SELECT id, teacher_id, current_month, mock_market_data FROM simulations WHERE is_playing = TRUE')
      .then(data => data.rows);



    if (!runningSimulations.length) return;
    const ids = runningSimulations.map(s => s.id).join(',');
    const updatedSimulations = await db
      .query(`UPDATE simulations SET current_month = current_month + 1 WHERE id IN (${ids}) RETURNING id, teacher_id, current_month, mock_market_data`)
      .then(data => data.rows);

    const sockets = await io.fetchSockets();
    for (const socket of sockets) {
      if (socket.data.user?.type === 'teacher') {
        socket.emit('CTRL_PANEL_UPDATE', updatedSimulations.find(s => s.teacher_id === socket.data.user?.id));
      }
    }
  }

  async function simulationStartHandler(simId) {

    // If simulation wasn't in loadedSimulations, add it
    if (!Object.keys(loadedSimulations).includes(String(simId))) {
      console.log(`💾  Adding simulation  ${simId}  to loadedSimulations object.`);
      const dbSimulation = await getSimulationById(simId);
      const newSimModel = new Simulation(db, io, dbSimulation);
      loadedSimulations[simId] = newSimModel;
      await newSimModel.setAllStudentData();
      await newSimModel.mountStudentSockets();
    }
    return;
  }

  async function updateLoadedSimulations() {
    const runningSims = await getRunningSimulations();
    const loadedSims = Object.keys(loadedSimulations);
    return;
  }

  async function updateSocketsCount() {
    const numSockets = (await io.fetchSockets()).map(socket => socket.id).length;
    console.log('\n📡  Connected Sockets: ', numSockets);
    if (numSockets < 1) {
      stopServingClients();
    }
  }
  function startServingClients() {
    if (!serveClientsInterval) {
      serveClientsInterval = setInterval(serveSimulationClients, INTERVAL_SECONDS * 1000);
    }
  }
  function stopServingClients() {
    if (serveClientsInterval) {
      clearInterval(serveClientsInterval);
      serveClientsInterval = null;
    }
  }
};
