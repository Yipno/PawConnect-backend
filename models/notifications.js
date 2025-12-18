const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['NEW_REPORT', 'REPORT_UPDATE'],
      required: true,
      index: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'animals',
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('notifications', notificationSchema);
module.exports = Notification;
