const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const aes256 = require('aes256');
const Admins = require('../models/Admins');
const moment = require("moment-timezone");
const {getNextSequence} = require("mongodb-autoincrement");
require('dotenv').config();



const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;


exports.signIn = async (req, res) => {
    try {
        const {admin_email, admin_password} = req.body;

        const admin = await Admins.findOne({$or: [{admin_email: admin_email}, {admin_username: admin_email}]});

        if (!admin) {
            return res.status(400).json({error: 'Invalid credentials. Please try again!!'});
        }
        var decryptedPlainText = aes256.decrypt(SECRET_KEY, admin.admin_password);

        console.log(decryptedPlainText);
        const isMatch = (admin_password === decryptedPlainText);

        if (!isMatch) {
            return res.status(400).json({error: 'Invalid credentials. Please try again!!'});
        }

        const token = jwt.sign({id: admin._id, admin_access: admin.admin_access}, SECRET_KEY);
        res.json({token: token, admin_name: admin.admin_name, admin_profile_image: admin.admin_profile_image,admin_department: admin.admin_department});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.saveAdmin = async (req, res) => {

    try {
        const adminData = JSON.parse(req.body.data);

        var image_file = "";

        if (req.file && req.file.filename.length > 0) {
            image_file = req.file.filename;
            console.log("FILE FOUND");


        } else if (adminData.admin_profile_image && adminData.admin_profile_image.length > 0) {
            image_file = adminData.admin_profile_image;

            console.log("FILE NOT FOUND " + adminData.admin_profile_image);
        }

        adminData.admin_profile_image = image_file;

        const admin = new Admins(adminData);
        await admin.save();
        res.json({status:1});
    } catch (error) {
        res.json({status:0,error: error.message});
    }
};

exports.updateAdmin = async (req, res) => {
    try {

        const adminData = JSON.parse(req.body.data);


        var image_file = "";

        if (req.file && req.file.filename.length > 0) {
            image_file = req.file.filename;
            console.log("FILE FOUND");


        } else if (adminData.admin_profile_image && adminData.admin_profile_image.length > 0) {
            image_file = adminData.admin_profile_image;

            console.log("FILE NOT FOUND " + adminData.admin_profile_image);
        }

        adminData.admin_profile_image = image_file;

        adminData.admin_password = await aes256.encrypt(SECRET_KEY, adminData.admin_password);

        const updatedAdmin = await Admins.findByIdAndUpdate(adminData._id, adminData, {new: true});

        if (!updatedAdmin) {
            return res.status(404).json({error: 'Admin not found'});
        }

        res.status(200).json({message: 'Admin updated successfully', admin: updatedAdmin});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.signUp = async (req, res) => {

    try {
        const admin = new Admins({
            admin_name: "Super Admin",
            admin_token: "",
            admin_username: "tradefuel",
            admin_email: "admin@tradefuel.com",
            admin_phone: "",
            admin_password: "12345678",
            admin_address: "",
            admin_department: "Management",
            admin_profile_image: "profile.png",
            admin_role: "S",
            admin_main: true,
            admin_access: {
                dashboard: true,
                subscriptions: true,
                banners: true,
                transactions: true,
                feedbacks: true,
                notifications: true,
                admins: true,
                settings: true,
            },
            admin_created_at: moment.tz('UTC').toDate(),
            admin_updated_at: moment.tz('UTC').toDate(),
            admin_trash: false,
        });
        await admin.save();
        res.status(201).json({message: 'User created successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.fetchAdmins = async (req, res) => {
    try {
        const admins = await Admins.find({admin_trash: false, admin_main: false});


        res.json(admins);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await Admins.findByIdAndUpdate(req.body.admin_id, {admin_trash: true}, {new: true});
        res.json(admin);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.fetchAdmin = async (req, res) => {
    try {
        const admin = await Admins.findById(req.body.admin_id);

        var password = aes256.decrypt(SECRET_KEY, admin.admin_password);
        admin.admin_password = password;

        res.json(admin);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.verifyAdminUsername = async (req, res) => {
    try {
//        const admins = await Admins.find({admin_trash: false, admin_main: false});
        var condition = {admin_trash: false, admin_username: req.body.admin_username};

        if (req.body.admin_id) {
            condition._id = {$ne: req.body.admin_id};
        }

        const admins = await Admins.find(condition);
        res.json(admins);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.verifyAdminEmail = async (req, res) => {
    try {
//        const admins = await Admins.find({admin_trash: false, admin_main: false});

        var condition = {admin_trash: false, admin_email: req.body.admin_email};

        if (req.body.admin_id) {
            condition._id = {$ne: req.body.admin_id};
        }

        const admins = await Admins.find(condition);
        res.json(admins);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
