const notificationRepo = require('../repositories/notification.repo');
const { assertValidObjectId, assertUserExists } = require('../utils/validators');

async function notifyUsers({ recipients, type, message, reportId }) {
  // Envoi de notifications aux utilisateurs

  const notifications = recipients.map(userId => ({
    recipient: userId,
    type,
    message,
    relatedReport: reportId,
    read: false,
  }));

  await notificationRepo.saveNewNotifications(notifications);
}

async function getNewUserNotifications(userId) {
  // get all notification that are not read
  await assertUserExists(userId);

  const notifications = await notificationRepo.getNewUserNotifications(userId);
  return notifications;
}

async function markNotificationAsRead(userId, notificationId) {
  await assertUserExists(userId);
  assertValidObjectId(notificationId, 'INVALID_NOTIFICATION_ID');

  const result = await notificationRepo.markNotificationAsRead(userId, notificationId);
  if (!result) {
    throw new Error('NOTIFICATION_NOT_FOUND');
  }
}

async function markAllUserNotificationAsRead(userId) {
  // check ownership of notifications to update
  await assertUserExists(userId);
  await notificationRepo.markAllUserNotificationAsRead(userId);
}

// async function deleteReadNotifications() {
//   // delete notifications if time is passed by one day
// }

module.exports = {
  notifyUsers,
  getNewUserNotifications,
  markNotificationAsRead,
  markAllUserNotificationAsRead,
};
