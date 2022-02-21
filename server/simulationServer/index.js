const INTERVAL_SECONDS = 5;
const dbHelpers = require('../db/dbHelpers');
const { fancyLog, log } = require('../helpers/fancyLogger');
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

    fancyLog('🟢', ['Client connected. socket id: ', socket.id], 0, true);

    if (!serveClientsInterval) {
      startServingClients();
    }

    socket.on('SET_USER', async (user) => {
      socket.user = user;
      socket.isTeacher = user.type === 'teacher';
      socket.isStudent = user.type === 'student';
      fancyLog('👤', `${user.name} has been set as the socket user.`, 2);
      fancyLog('↳', `socket.user obj keys: ${Object.keys(user)}`, 3);

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
      fancyLog('🚪=>', `${socket.user?.name} joined simulation with key: ${simKey}`, 0, true);
    });

    socket.on('LEAVE_SIMULATION', simKey => {
      const teacherSimRoom = 't-' + simKey;
      socket.leave(teacherSimRoom);
      fancyLog('🚪<=', `${socket.user?.name} left simulation with key: ${simKey}`, 0, true);
    });

    socket.on('PLAY_PAUSE_SIMULATION', async (simulationKey) => {
      // Validate request
      const simId = await getSimulationId(simulationKey);
      const teacher = await getTeacherForSimulation(simId);
      if (teacher.id !== socket.user.id || socket.isStudent) return;

      // Toggle isPlaying & send new isPlaying state
      const dbUpdatedRow = await toggleIsPlaying(simId);
      const simWasStarted = dbUpdatedRow.is_playing;
      socket.emit('PLAY_PAUSE_UPDATE', simWasStarted);
      fancyLog('⏯', `${socket.user.name} ${simWasStarted ? 'started' : 'paused'} simulation ${simId} (${simulationKey})`, 0, true);

      // If simulation has been started, run simulationStartHandler
      simWasStarted && simulationStartHandler(simId);
    });

    socket.on('disconnect', (reason) => {
      fancyLog('❌', [socket.user?.name, 'was disconnected. socket id: ', socket.id], 0, true);
      fancyLog('↳', `reason: ${reason}`, 2);
      updateSocketsCount();
    });

  });


  // Called on every interval while serving clients
  async function serveSimulationClients() {

    // Log a dot on each call of this function
    process.stdout.write(".");


    // Sync all simulations with DB in parallel
    let syncPromises = [];
    for (const simId in loadedSimulations) {
      const sim = loadedSimulations[simId];
      syncPromises.push(sim.sync());
    }
    await Promise.all(syncPromises);
    // fancyLog('🔸', 'Done syncing simulations');


    // Update all simulation models with
    // new month and balances
    let updatePromises = [];
    for (const simId in loadedSimulations) {
      const sim = loadedSimulations[simId];
      updatePromises.push(sim.update());
    }
    await Promise.all(updatePromises);
    // fancyLog('🔸', 'Done updating simulations');


    // Persist all updates on simulation
    // to the database
    let persistPromises = [];
    for (const simId in loadedSimulations) {
      const sim = loadedSimulations[simId];
      persistPromises.push(sim.persist());
    }
    await Promise.all(persistPromises);
    // fancyLog('🔸', 'Done persisting simulation updates to database');


    // Broadcast changes to sockets connected
    let castPromises = [];
    for (const simId in loadedSimulations) {
      const sim = loadedSimulations[simId];
      castPromises.push(sim.broadcast());
    }
    await Promise.all(castPromises);
    // fancyLog('🔸', 'Done broadcasting updates from simulations to socket connections');

  }


  // Called every time a simulation starts playing
  async function simulationStartHandler(simId) {

    // If simulation wasn't in loadedSimulations, add it
    if (!Object.keys(loadedSimulations).includes(String(simId))) {
      console.log(`💾  Adding simulation  ${simId}  to loadedSimulations object.`);
      const dbSimulation = await getSimulationById(simId);

      // Create model for simulation
      const newSimModel = new Simulation(db, io, dbSimulation);

      // Populate model with database students, accounts, transactions,
      // connected sockets, etc.
      await newSimModel.sync();

      loadedSimulations[simId] = newSimModel;
    }
    return;
  }

  // Counts sockets & stops interval if no one is connected
  async function updateSocketsCount() {
    const numSockets = (await io.fetchSockets()).map(socket => socket.id).length;
    fancyLog('📡', `Connected sockets: ${numSockets}`, 0, true);
    if (numSockets < 1) {
      fancyLog('↳', 'stopping interval that serves clients', 2);
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
