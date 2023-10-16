const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const moment = require('moment-timezone');
const {number} = require("yup");


const UserSchema = new mongoose.Schema({
    user_name: {type: String, default: ""},
    user_email: {type: String, default: ""},
    user_phone: {type: String, default: ""},
    user_subscription: {type: String, default: ""},
    user_balance: {type: Number, default: 50000},
    user_notification_token: [{type: String}],
    user_created_at: {type: Date, default: moment.tz('UTC').toDate()},
    user_block: {type: Boolean, default: false},
    user_trash: {type: Boolean, default: false},
    user_watchlist: [{
        stock_symbol: {type: String, required: true},
        stock_name: {type: String, default: ""}
    }],
    user_alerts: [{
        stock_symbol: {type: String, required: true},
        stock_name: {type: String, default: ""},
        alert_amount:{type: Number, default: 0},
        alert_amount_type: {type: String, default: ""},
        alert_type: {type: String, default: ""},
        alert_created_at: {type: Date, default: moment.tz('UTC').toDate()},
    }],


});


UserSchema.pre('save', async function (next) {
    next();
});

const Users = mongoose.model('users', UserSchema);
module.exports = Users;
