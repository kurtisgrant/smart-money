const http = require('http');
const { Server } = require('socket.io');


module.exports = (app) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  server.listen(4545, () => {
    console.log('Listening for socket.io connections on port 4545');
  });
  return io;
}