const INTERVAL_SECONDS = 1;
const dbHelpers = require('../db/dbHelpers');
const Simulation = require('./Simulation');


module.exports = (io, db) => {
  const { getSimulationId, getSimulationById, getTeacherForSimulation, toggleIsPlaying, getRunningSimulations } = dbHelpers(db);
  let serveClientsInterval;
  const loadedSimulations = {};

  io.on('connection', (socket) => {
    console.log('\n🟢 client connected. socket id: ', socket.id);
    if (!serveClientsInterval) {
      startServingClients();
    }
    socket.on('SET_USER', async (user) => {
      socket.user = user;
      socket.isTeacher = user.type === 'teacher';
      socket.isStudent = user.type === 'student';
      // user.type === 'student' && socket.simulatio
      console.log(
        `👤   ${user.name} has been set as the socket user.
        ↳ user obj: `, user);
    });

    socket.on('PLAY_PAUSE_SIMULATION', async (simulationKey) => {
      // Validate request
      const simId = await getSimulationId(simulationKey);
      const teacher = await getTeacherForSimulation(simId);
      if (teacher.id !== socket.user.id || socket.isStudent) return;

      // Toggle isPlaying & send new isPlaying state
      const dbUpdatedRow = await toggleIsPlaying(simId);
      const newIsPlaying = dbUpdatedRow.is_playing;
      console.log(`\n⏯  ${socket.user.name} ${newIsPlaying ? 'started' : 'paused'} simulation ${simId} (${simulationKey})`);
      socket.emit('PLAY_PAUSE_UPDATE', newIsPlaying);

      // If simulation has been started, ensure it is in loadedSimulations
      if (newIsPlaying && !Object.keys(loadedSimulations).includes(simId)) {
        const dbSimulation = await getSimulationById(simId);
        loadedSimulations[simId] = new Simulation(db, io, dbSimulation);
      }

    });

    socket.on('disconnect', (reason) => {
      console.log(
        `\n❌ client disconnected. socket id: ${socket.id}
        ↳ reason: ${reason}
        ↳ user was: ${socket.data.user?.name || 'not logged in'}`);
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

  async function updateLoadedSimulations() {
    const runningSims = await getRunningSimulations();
    const loadedSims = Object.keys(loadedSimulations);
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
