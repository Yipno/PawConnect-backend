require('dotenv').config();
require('./models/connection');
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth.routes');
const uploadRouter = require('./routes/upload.routes');
const animalsRouter = require('./routes/animals.routes');
const establishmentsRouter = require('./routes/establishments');
const notificationsRouter = require('./routes/notifications.routes');
const errorHandler = require('./middlewares/errorHandler');
const { globalLimiter } = require('./utils/rateLimiter');

const app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

app.use(globalLimiter);

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/animals', animalsRouter);
app.use('/establishments', establishmentsRouter);
app.use('/notifications', notificationsRouter);

app.use(errorHandler);

module.exports = app;
