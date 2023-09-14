const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file



const moment = require('moment-timezone');


const BannerSchema = new mongoose.Schema({
    banner_name: {type: String, required: true},
    banner_type: {type: String},
    banner_text: {type: String},
    banner_image: {type: String},
    banner_position: {type: String},
    banner_expires_at: {type: Date, required: true, default: moment.tz('UTC').toDate()},
    banner_created_at: {type: Date, default: moment.tz('UTC').toDate()},
    banner_updated_at: {type: Date, default: moment.tz('UTC').toDate()},
    banner_trash: {type: Boolean, default: false},
});


BannerSchema.pre('save', async function (next) {

    next();
});

const Banners = mongoose.model('banners', BannerSchema);
module.exports = Banners;
