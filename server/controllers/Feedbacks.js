const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const aes256 = require('aes256');
const Feedbacks = require('../models/Feedbacks');
const Users = require('../models/Users');
const moment = require("moment-timezone");
const {getNextSequence} = require("mongodb-autoincrement");
const Admins = require("../models/Admins");
require('dotenv').config();


exports.fetchFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedbacks.find().populate('user');

        res.json(feedbacks);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.saveFeedback = async (req, res) => {
    try {


        const feedback = new Feedbacks({
            feedback_comments: req.body.feedback_comments,
            feedback_stars: req.body.feedback_stars,
            user: req.body.user
        });
        const savedFeedback = await feedback.save();

        res.json({status: 1, data: savedFeedback});


    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
