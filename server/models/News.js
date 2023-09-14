const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file



const moment = require('moment-timezone');


const NewsSchema = new mongoose.Schema({
    news_title: {type: String, required: true},
    news_body: {type: String},
    news_image: {type: String},
    news_author:{type:String},
    news_video: {type: String},
    news_created_at: {type: Date, default: moment.tz('UTC').toDate()},
    news_updated_at: {type: Date, default: moment.tz('UTC').toDate()},
    news_trash: {type: Boolean, default: false},
});


NewsSchema.pre('save', async function (next) {

    next();
});

const News = mongoose.model('news', NewsSchema);
module.exports = News;
