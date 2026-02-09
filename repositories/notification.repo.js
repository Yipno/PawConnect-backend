const Notification = require('../models/Notification.model');

async function getNewUserNotifications(userId) {
  const notifications = await Notification.find({ recipient: userId, read: false }).sort({
    createdAt: -1,
  });
  return notifications;
}

async function saveNewNotifications(notifications) {
  const result = await Notification.insertMany(notifications);
  return result.length === notifications.length;
}

async function markNotificationAsRead(recipientId, id) {
  const result = await Notification.findOneAndUpdate(
    { _id: id, recipient: recipientId },
    { read: true },
  );
  return result;
}

async function markAllUserNotificationAsRead(recipientId) {
  await Notification.updateMany({ recipient: recipientId, read: false }, { read: true });
}

module.exports = {
  getNewUserNotifications,
  saveNewNotifications,
  markNotificationAsRead,
  markAllUserNotificationAsRead,
};
