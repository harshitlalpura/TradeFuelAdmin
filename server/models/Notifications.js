const mongoose = require('mongoose');
require('dotenv').config();
const moment = require('moment-timezone');

const NotificationSchema = new mongoose.Schema({
    notification_heading: { type: String, required: true },
    notification_preview_text: { type: String },
    notification_text: { type: String },
    notification_image: { type: String },
    notification_type: { type: String },
    notification_group: { type: mongoose.Schema.Types.ObjectId, ref: 'notificationgroups', required: false },
    notification_scheduled: { type: Boolean },
    notification_datetime: { type: Date, default: moment.tz('UTC').toDate() },
    notification_created_at: { type: Date, default: moment.tz('UTC').toDate() },
    notification_updated_at: { type: Date, default: moment.tz('UTC').toDate() },
    notification_trash: { type: Boolean, default: false },
});

NotificationSchema.pre('save', async function (next) {
    next();
});

const Notifications = mongoose.model('notifications', NotificationSchema);

module.exports = Notifications;
