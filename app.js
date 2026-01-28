require('dotenv').config();
require('./models/connection');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

var indexRouter = require('./routes/index');
const authRouter = require('./routes/auth.routes');
var usersRouter = require('./routes/users');
const uploadRouter = require('./routes/upload.routes');
const animalsRouter = require('./routes/animals.routes');
var establishmentsRouter = require('./routes/establishments');
var notificationsRouter = require('./routes/notifications');
const errorHandler = require('./middlewares/errorHandler');

var app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload()); // TODO A DEPLACER SUR LA ROUTE UPLOAD
const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);
app.use('/animals', animalsRouter);
app.use('/establishments', establishmentsRouter);
app.use('/notifications', notificationsRouter);

app.use(errorHandler);

module.exports = app;
