const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const setupWebSockets = require('./webSockets/setupWebSockets');
const serveSimulations = require('./simulationServer');

// Database connection
const db = require('./configs/db.config');

const { toggleIsPlaying } = require('./db/dbHelpers')(db);
toggleIsPlaying(1).then(console.log);

const app = express();

// WebSockets
const io = setupWebSockets(app);

serveSimulations(io, db);

// Route files
const teachersRouter = require('./routes/teachers');
const simulationsRouter = require('./routes/simulations');
const studentsRouter = require('./routes/students');

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
