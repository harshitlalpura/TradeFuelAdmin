const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file



const moment = require('moment-timezone');


const LearnSchema = new mongoose.Schema({
    learn_title: {type: String, required: true},
    learn_sub_title: {type: String, required: true},
    learn_body: {type: String},
    learn_image: {type: String},
    learn_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'learnCategories'
    },
    learn_video: {type: String},
    learn_created_at: {type: Date, default: moment.tz('UTC').toDate()},
    learn_updated_at: {type: Date, default: moment.tz('UTC').toDate()},
    learn_trash: {type: Boolean, default: false},
});


LearnSchema.pre('save', async function (next) {

    next();
});

const Learn = mongoose.model('learn', LearnSchema);
module.exports = Learn;
