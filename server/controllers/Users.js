const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const aes256 = require('aes256');
const Feedbacks = require('../models/Feedbacks');
const Users = require('../models/Users');
const moment = require("moment-timezone");
const {getNextSequence} = require("mongodb-autoincrement");
const Admins = require("../models/Admins");
const News = require("../models/News");
const Learn = require("../models/Learn");
const Transactions = require("../models/Transactions");

require('dotenv').config();
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

exports.fetchUsers = async (req, res) => {
    try {
        const users = await Users.find({user_trash: false});


        res.json(users);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.fetchTransactions = async (req, res) => {
    try {
        //  const users = await Users.find({user_trash: false});


        res.json([]);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.fetchTransactions = async (req, res) => {
    try {
        //  const users = await Users.find({user_trash: false});


        res.json([]);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.fetchAllVisitors = async (req, res) => {
    try {
        const users = await Users.find({user_trash: false}, {user_created_at: 1, _id: 0});


        console.log(users);

        res.json(users);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.verifyPhone = async (req, res) => {
    try {
        const users = await Users.find({user_phone: req.body.user_phone, user_trash: false});


        if (users.length == 0) {

            res.json({status: 1});
        } else {
            res.json({status: 0, message: "Phone Number already exists."});

        }


    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        console.log(req.body);

        const users = await Users.find({user_phone: req.body.user_phone, user_trash: false});

        if (users.length > 0) {
            res.json({status: 1});
        } else {
            res.json({status: 0, message: "Phone Number not found."});

        }

    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.loginUser = async (req, res) => {
    try {
        const users = await Users.find({user_phone: req.body.user_phone, user_trash: false});


        if (users.length > 0) {

            if (users.user_block) {
                res.json({
                    status: 0,
                    message: "You are blocked by admin for violating the terms and conditions of the TradeFuel. Please contact TradeFuel to resolve this issue."
                });
            } else {
                const token = jwt.sign({id: users._id}, SECRET_KEY);


                res.json({status: 1, data: users});
            }
        } else {
            res.json({status: 0, message: "No account is associated with this phone number."});
        }


    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.changeUserStatus = async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(req.body._id, {user_block: !req.body.user_block}, {new: true});
        res.json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(req.body.user_id, {user_trash: true}, {new: true});
        res.json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.fetchUser = async (req, res) => {
    try {
        const user = await Users.findById(req.body.user_id);


        res.json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.saveUser = async (req, res) => {
    try {
        console.log(req.body);
        const users = await Users.find({user_phone: req.body.user_phone, user_trash: false});


        if (users.length == 0) {


            const newUser = new Users({
                user_phone: req.body.user_phone,
                user_email: req.body.user_email,
                user_name: req.body.user_name,
                user_gender: req.body.user_gender,
                user_trash: false
            });
            const savedUser = await newUser.save();

            res.json({status: 1, data: savedUser});
        } else {
            res.json({status: 0, message: "Phone Number already exists."});

        }


    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateNotificationToken = async (req, res) => {
    const {userId, notificationTokens} = req.body;

    try {
        // Find the user by ID
        const user = await Users.findByIdAndUpdate(
            userId,
            {$addToSet: {user_notification_token: {$each: notificationTokens}}},
            {new: true}
        );

        if (!user) {
            return res.json({status: 0, message: 'User not found'});
        }

        res.json({status: 1, data: user});
    } catch (error) {
        return res.json({status: 0, message: error.message});
    }
};

exports.fetchLeaderboardByEarnings = async (req, res) => {

    try {
        let fromDate = req.body.fromDate;
        let toDate = req.body.toDate;
        console.log(req.body.time,fromDate,toDate);

        if (req.body.time == "D") {

            toDate = fromDate;


            fromDate = moment(fromDate,"DD/MM/YYYY").toDate();
            toDate = moment(toDate,"DD/MM/YYYY").toDate();

        } else if (req.body.time == "W") {

            fromDate = moment(fromDate,"DD/MM/YYYY").toDate();
            toDate = moment(toDate,"DD/MM/YYYY").toDate();
        } else if (req.body.time == "M") {

            fromDate = moment(fromDate,"DD/MM/YYYY").toDate();
            toDate = moment(toDate,"DD/MM/YYYY").toDate();
        } else if (req.body.time == "C") {

            fromDate = moment(fromDate,"DD/MM/YYYY").toDate();
            toDate = moment(toDate,"DD/MM/YYYY").toDate();
        }

        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        console.log(fromDate,toDate);

        const result = await Transactions.aggregate([
            {
                $match: {
                    transactionType: 'S',
                    createdAt: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            },
            {
                $group: {
                    _id: '$userId',
                    totalProfit: {$sum: '$profit'}
                }
            },
            {
                $sort: {
                    totalProfit: -1
                }
            },
            {
                $lookup: {
                    from: 'users', // The name of the users collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user' // Unwind the user array created by $lookup
            },
            {
                $project: {
                    _id: 1,
                    totalProfit: 1,
                    user_name: '$user.user_name' // Assuming 'user_name' is the field in the users collection
                }
            }
        ]);

        console.log(result);
        res.json({success: true, data: result});

    } catch (error) {
        console.error(error);
        res.json({success: false, error: error});
    }
}
exports.fetchLeaderboardByVolume = async (req, res) => {

    try {
        // Get the current date


        let fromDate = req.body.fromDate;
        let toDate = req.body.toDate;
        console.log(req.body.time,fromDate,toDate);

        if (req.body.time == "D") {

            toDate = fromDate;


            fromDate = moment(fromDate,"DD/MM/YYYY").toDate();
            toDate = moment(toDate,"DD/MM/YYYY").toDate();

        } else if (req.body.time == "W") {

            fromDate = moment(fromDate,"DD/MM/YYYY").toDate();
            toDate = moment(toDate,"DD/MM/YYYY").toDate();
        } else if (req.body.time == "M") {

            fromDate = moment(fromDate,"DD/MM/YYYY").toDate();
            toDate = moment(toDate,"DD/MM/YYYY").toDate();
        }else if (req.body.time == "C") {

            fromDate = moment(fromDate,"DD/MM/YYYY").toDate();
            toDate = moment(toDate,"DD/MM/YYYY").toDate();
        }

        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        console.log(fromDate,toDate);

        const result = await Transactions.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            },
            {
                $group: {
                    _id: '$userId',
                    totalQuantity: {$sum: '$quantity'}
                }
            },
            {
                $sort: {
                    totalQuantity: -1
                }
            },
            {
                $lookup: {
                    from: 'users', // The name of the users collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user' // Unwind the user array created by $lookup
            },
            {
                $project: {
                    _id: 1,
                    totalQuantity: 1,
                    user_name: '$user.user_name' // Assuming 'user_name' is the field in the users collection
                }
            }
        ]);

        console.log(result);
        res.json({success: true, data: result});
    } catch (error) {
        console.error(error);
        res.json({success: false, error: error});
    }
}
exports.updateUser = async (req, res) => {
    try {
        console.log(req.body);


        const users = await Users.find({
            user_phone: req.body.user_phone,
            user_trash: false,
            _id: {$ne: req.body.user_id}
        });

        if (users.length == 0) {


            const userData = {
                user_phone: req.body.user_phone,
                user_email: req.body.user_email,
                user_name: req.body.user_name,
                _id: req.body.user_id,
            };

            const updatedUser = await Users.findByIdAndUpdate(userData._id, userData, {new: true});

            if (!updatedUser) {
                return res.status(404).json({error: 'User not found'});
            }

            res.status(200).json({status: 1, message: 'User updated successfully', user: updatedUser});
        } else {
            res.json({status: 0, message: "Phone Number already exists."});

        }


    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
