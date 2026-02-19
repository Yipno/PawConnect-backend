const express = require('express');
const router = express.Router();
const controller = require('../controllers/notification.controller');
const authJWT = require('../middlewares/auth.middleware');

router.use(authJWT); // Apply auth middleware to all routes in this router

router.get('/', controller.getAllNewNotifications);

router.patch('/:id/read', controller.markUserNotificationAsRead);

router.patch('/read-all', controller.markAllUserNotificationsAsRead);

module.exports = router;
