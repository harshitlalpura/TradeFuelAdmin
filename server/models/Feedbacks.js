const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const moment = require('moment-timezone');


const FeedbackSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    feedback_comments: { type: String, default: "" },
    feedback_stars: { type: Number, required: true, default: 0 },
    feedback_created_at: { type: Date, default: moment.tz('UTC').toDate() },
    feedback_trash: { type: Boolean, default: false },
});


FeedbackSchema.pre('save', async function (next) {
    next();
});

const Feedbacks = mongoose.model('feedbacks', FeedbackSchema);
module.exports = Feedbacks;
