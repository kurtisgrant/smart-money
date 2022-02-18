

module.exports = (io, db) => {




  io.on('connection', (socket) => {
    console.log('🟢 client connected. socket id: ', socket.id);
    socket.on('disconnect', (reason) => {
      console.log(
        `❌ client disconnected. socket id: ${socket.id}
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
      console.log(`👻  ${socket.data.user.name} logged out.`);
      socket.data.user = null;
    });
  });
}
