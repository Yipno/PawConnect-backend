require('dotenv').config();
require('./models/connection');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth.routes');
const usersRouter = require('./routes/users');
const animalsRouter = require('./routes/animals');
const establishmentsRouter = require('./routes/establishments');
const notificationsRouter = require('./routes/notifications');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
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
app.use('/animals', animalsRouter);
app.use('/establishments', establishmentsRouter);
app.use('/notifications', notificationsRouter);

app.use(errorHandler);

module.exports = app;
