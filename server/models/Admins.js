const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file



const aes256 = require('aes256');


const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const moment = require('moment-timezone');


const AdminSchema = new mongoose.Schema({
    admin_name: {type: String, required: true},
    admin_token: {type: String},
    admin_username: {type: String, unique: true},
    admin_email: {type: String, required: true, unique: true},
    admin_phone: {type: String},
    admin_password: {type: String, required: true},
    admin_address: {type: String},
    admin_department: {type: String},
    admin_profile_image: {type: String, default: "profile.png"},
    admin_role: {type: String, default: "S"},
    admin_main: {type: Boolean, default: false},
    admin_access: {
        dashboard: {type: Boolean, default: false},
        subscriptions: {type: Boolean, default: false},
        banners: {type: Boolean, default: false},
        transactions: {type: Boolean, default: false},
        feedbacks: {type: Boolean, default: false},
        notifications: {type: Boolean, default: false},
        admins: {type: Boolean, default: false},
        settings: {type: Boolean, default: false},
        news: {type: Boolean, default: false},
    },
    admin_created_at: {type: Date, default: moment.tz('UTC').toDate()},
    admin_updated_at: {type: Date, default: moment.tz('UTC').toDate()},
    admin_trash: {type: Boolean, default: false},
});


AdminSchema.pre('save', async function (next) {
    if (this.isModified('admin_password')) {
        this.admin_password = await aes256.encrypt(SECRET_KEY,this.admin_password);
    }
    next();
});

const Admins = mongoose.model('admins', AdminSchema);
module.exports = Admins;
