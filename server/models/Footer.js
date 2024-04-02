const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file



const moment = require('moment-timezone');


const FooterSchema = new mongoose.Schema({
    footer_description: {type: String},
    customer_service: {type: String},
    whatsapp: {type: String},
    footer_privcacy: {type: String},
    facebook_link: {type: String},
    twitter_link: {type: String},
    instagram_link: {type: String},
    linkedin_link: {type: String},
    google_link:{type: String},
    footer_created_at: {type: Date, default: moment.tz('UTC').toDate()},
    footer_updated_at: {type: Date, default: moment.tz('UTC').toDate()},
    footer_trash: {type: Boolean, default: false},
});


FooterSchema.pre('save', async function (next) {

    next();
});

const Footer = mongoose.model('footer', FooterSchema);
module.exports = Footer;
