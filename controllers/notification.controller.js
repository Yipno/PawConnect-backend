const notificationService = require('../services/notification.service');

async function getAllNewNotifications(req, res, next) {
  const userId = req.userId;
  try {
    const notifications = await notificationService.getNewUserNotifications(userId);
    return res.status(200).json({ notifications });
  } catch (err) {
    next(err);
  }
}

async function markUserNotificationAsRead(req, res, next) {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await notificationService.markNotificationAsRead(userId, id);
    return res.status(200).json({ result: true });
  } catch (err) {
    next(err);
  }
}

async function markAllUserNotificationAsRead(req, res, next) {
  const userId = req.userId;

  try {
    await notificationService.markAllUserNotificationAsRead(userId);
    return res.status(200).json({ result: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllNewNotifications,
  markUserNotificationAsRead,
  markAllUserNotificationAsRead,
};
