const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
;
const Admins = require('../models/NotificationGroups');
const moment = require("moment-timezone");
const {getNextSequence} = require("mongodb-autoincrement");
const NotificationGroups = require("../models/NotificationGroups");
const Users = require("../models/Users");
const LearnCategories = require("../models/LearnCategories");
require('dotenv').config();

exports.saveNotificationGroup = async (req, res) => {

    try {
        const {notification_group_name} = req.body;

        const newNotificationGroup = new NotificationGroups({
            notification_group_name: notification_group_name,
        });

        const savedNotificationGroup = await newNotificationGroup.save();

        res.json(savedNotificationGroup);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.fetchAllNotificationGroups = async (req, res) => {


    try {
        const notificationGroups = await NotificationGroups.find({notification_group_trash: false});
        res.json(notificationGroups);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateNotificationGroup = async (req, res) => {
    const { notification_group_id, notification_group_users } = req.body;

    try {
        // Find the notification group by ID
        const notificationGroup = await NotificationGroups.findById(notification_group_id);
        if (!notificationGroup) {
            return res.status(404).json({ error: 'Notification group not found' });
        }

        // Find the selected users by their IDs
        const users = await Users.find({ _id: { $in: notification_group_users } });

        // Get the unique user IDs from the existing array
        const existingUserIds = new Set(notificationGroup.notification_group_users.map(user => user.toString()));

        // Filter out any duplicate user IDs from the new users
        const uniqueUsers = users.filter(user => !existingUserIds.has(user._id.toString()));

        // Update the notification group with the unique users
        notificationGroup.notification_group_users.push(...uniqueUsers);

        // Save the updated notification group
        const updatedNotificationGroup = await notificationGroup.save();

        res.json(updatedNotificationGroup);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
