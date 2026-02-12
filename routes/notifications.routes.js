const express = require('express');
const router = express.Router();
const controller = require('../controllers/notification.controller');
const authJWT = require('../middlewares/auth.middleware');

router.get('/', authJWT, controller.getAllNewNotifications);

router.patch('/:id/read', authJWT, controller.markUserNotificationAsRead);

router.patch('/read-all', authJWT, controller.markAllUserNotificationsAsRead);

module.exports = router;
