const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const moment = require('moment-timezone');
const {boolean} = require("yup");


const SettingsSchema = new mongoose.Schema({
    payment_gateway_account: {type: String, default: ""},
    payment_gateway_auth_token: {type: String, default: ""},
    payment_gateway_key: {type: String, default: ""},
    payment_gateway_mode: {type: String, default: "Sandbox"},
    stock_market_key: {type: String, default: ""},
    stock_market_token: {type: String, default: ""},
    contact_us_name: {type: String, default: ""},
    contact_us_address: {type: String, default: ""},
    contact_us_time: {type: String, default: ""},
    contact_us_phone: {type: String, default: ""},
    contact_us_email: {type: String, default: ""},
    maintainance_admin: {type: String, default: "off"},
    maintainance_app: {type: String, default: "off"},
    settings_updated_at: {type: Date, default: moment.tz('UTC').toDate()}
});


SettingsSchema.pre('save', async function (next) {
    next();
});

const Settings = mongoose.model('settings', SettingsSchema);
module.exports = Settings;
