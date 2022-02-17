const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

// Database connection
const db = require('./configs/db.config');

// Route files
const teachersRouter = require('./routes/teachers');
const simulationsRouter = require('./routes/simulations');
const studentsRouter = require('./routes/students');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('🟢 client connected. socket id: ', socket.id);
  socket.on('disconnect', (reason) => {
    console.log(
      `❌ client disconnected. socket id: ${socket.id}
      ↳ reason: ${reason}
      ↳ user was: ${socket.data.user?.name || 'not logged in'}`);
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

server.listen(4545, () => {
  console.log('Listening for socket.io connections on port 4545');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api/teachers', teachersRouter(db));
app.use('/api/simulations', simulationsRouter(db));
app.use('/api/students', studentsRouter(db));

module.exports = app;
