
module.exports = (io, db) => {
  let serveClientsInterval;

  io.on('connection', (socket) => {
    console.log('\n🟢 client connected. socket id: ', socket.id);
    if (!serveClientsInterval) {
      startServingClients();
    }

    socket.on('disconnect', (reason) => {
      console.log(
        `\n❌ client disconnected. socket id: ${socket.id}
        ↳ reason: ${reason}
        ↳ user was: ${socket.data.user?.name || 'not logged in'}`);
      updateSocketsCount();
    });
    socket.on('CLIENT_LOGIN', (user) => {
      socket.data.user = user;
      console.log(
        `👤  ${user.name} logged in.
        ↳ user obj: `, user);
    });
    socket.on('CLIENT_LOGOUT', () => {
      console.log(`\n👻  ${socket.data.user.name} logged out.`);
      socket.data.user = null;
    });
  });

  async function serveSimulationClients() {
    process.stdout.write(".");
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
      serveClientsInterval = setInterval(serveSimulationClients, 1000);
    }
  }
  function stopServingClients() {
    if (serveClientsInterval) {
      clearInterval(serveClientsInterval);
      serveClientsInterval = null;
    }
  }
};
