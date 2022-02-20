const INTERVAL_SECONDS = 1;
const dbHelpers = require('../db/dbHelpers')


module.exports = (io, db) => {
  const { getSimulationById } = dbHelpers;
  let serveClientsInterval;

  io.on('connection', (socket) => {
    console.log('\n🟢 client connected. socket id: ', socket.id);
    if (!serveClientsInterval) {
      startServingClients();
    }
    socket.on('SET_USER', async (user) => {
      socket.user = user;
      // user.type === 'student' && socket.simulatio
      console.log(
        `👤  ${user.name} has been set as the socket user.
        ↳ user obj: `, user);
    });

    socket.on('disconnect', (reason) => {
      console.log(
        `\n❌ client disconnected. socket id: ${socket.id}
        ↳ reason: ${reason}
        ↳ user was: ${socket.data.user?.name || 'not logged in'}`);
      updateSocketsCount();
    });




    /* 
     * This TOGGLE_ISPLAYING is a spaghetti-like.
     * some of this functionality should ultimately
     * be abstracted away or performed by HTTP requests
     */

    socket.on('TOGGLE_ISPLAYING', async simulationKey => {
      console.log(`\n⏯  ${socket.data.user.name} requested play/pause.`);

      const user = socket.data.user;
      const ownsSimulation = await db.query('SELECT teacher_id FROM simulations WHERE simulation_key = $1', [simulationKey])
        .then(data => data.rows[0]?.teacher_id === user.id && user.type === 'teacher');

      if (!ownsSimulation) return;

      db.query('UPDATE simulations SET is_playing = NOT is_playing WHERE simulation_key = $1 RETURNING id, name, simulation_key, is_playing, teacher_id', [simulationKey])
        .then(data => console.log('   ↳ updated values: ', data.rows));
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
