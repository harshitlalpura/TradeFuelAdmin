const mongoose = require('mongoose');
require('dotenv').config();
const moment = require('moment-timezone');

const NotificationGroupSchema = new mongoose.Schema({
    notification_group_name: { type: String, required: true },
    notification_group_users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    notification_group_created_at: { type: Date, default: moment.tz('UTC').toDate() },
    notification_group_updated_at: { type: Date, default: moment.tz('UTC').toDate() },
    notification_group_trash: { type: Boolean, default: false },
});

NotificationGroupSchema.pre('save', async function (next) {
    next();
});

const NotificationGroup = mongoose.model('notificationgroups', NotificationGroupSchema);

module.exports = NotificationGroup;
