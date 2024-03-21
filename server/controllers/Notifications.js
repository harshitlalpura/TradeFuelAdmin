const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
;
const Admins = require('../models/Notifications');
const moment = require("moment-timezone");
const {getNextSequence} = require("mongodb-autoincrement");
const Notifications = require("../models/Notifications");
const NotificationGroups = require("../models/NotificationGroups");
const Users = require("../models/Users");
const fetch=require("node-fetch");

require('dotenv').config();


exports.saveNotification = async (req, res) => {

    try {
        const notificationData = JSON.parse(req.body.data);

        var image_file = "";

        if (req.file && req.file.filename.length > 0) {
            image_file = req.file.filename;
            console.log("FILE FOUND");


        } else if (notificationData.notification_image && notificationData.notification_image.length > 0) {
            image_file = notificationData.notification_image;

            console.log("FILE NOT FOUND " + notificationData.notification_image);
        }

        notificationData.notification_image = image_file;

        if(notificationData.notification_datetime=="" && !notificationData.notification_group){
            notificationData.notification_datetime=moment.tz('UTC').toDate();
        }

        if(notificationData.notification_datetime=="" && notificationData.notification_group){
            notificationData.notification_datetime=moment.tz('UTC').toDate();
        }

        const notification = new Notifications(notificationData);
        await notification.save();

        // Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
        console.log('notification_group',notificationData.notification_group);

        let notificationTokens;
        if (notificationData.notification_group) {
            const group = await NotificationGroups.findById(notificationData.notification_group).populate('notification_group_users', 'user_notification_token');
            if (!group) {
                console.log("Notification group not found");
                return null;
            }
             notificationTokens = group.notification_group_users.map(user => user.user_notification_token).flat();
        } else {
            const users = await Users.find({}, 'user_notification_token');
            notificationTokens = users.map(user => user.user_notification_token).reduce((acc, curr) => acc.concat(curr), []);
        }
        notificationTokens = notificationTokens.filter((item, index) => notificationTokens.indexOf(item) === index);
        console.log("Recipients", notificationTokens);
        const message = {
            to: notificationTokens,
            sound: 'default',
            title: notificationData.notification_heading,
            subtitle: notificationData.notification_preview_text,
            body: notificationData.notification_text
        };

        if(notificationData.notification_scheduled) {
            /*await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
                trigger: {
                    seconds: Math.floor((new Date(notificationData.notification_datetime) - Date.now()) / 1000),
                },
            });*/
        } else {
            await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
        }

        res.status(200).json({message: 'Notification created successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateNotification = async (req, res) => {
    try {

        const notificationData = JSON.parse(req.body.data);


        var image_file = "";

        if (req.file && req.file.filename.length > 0) {
            image_file = req.file.filename;
            console.log("FILE FOUND");


        } else if (notificationData.notification_image && notificationData.notification_image.length > 0) {
            image_file = notificationData.notification_image;

            console.log("FILE NOT FOUND " + notificationData.notification_image);
        }

        notificationData.notification_image = image_file;


        const updatedNotification = await Notifications.findByIdAndUpdate(notificationData._id, notificationData, {new: true});

        if (!updatedNotification) {
            return res.status(404).json({error: 'Notification not found'});
        }

        res.status(200).json({message: 'Notification updated successfully', notification: updatedNotification});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.fetchNotifications = async (req, res) => {
    try {
        const notifications = await Notifications.find({notification_trash: false})
            .sort({notification_created_at: -1})
            .populate('notification_group', 'notification_group_name');


        res.json(notifications);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notifications.findByIdAndUpdate(req.body.notification_id, {notification_trash: true}, {new: true});
        res.json(notification);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.fetchNotification = async (req, res) => {
    try {
        const notification = await Notifications.findById(req.body.notification_id);


        res.json(notification);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
