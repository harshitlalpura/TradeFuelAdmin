const mongoose = require('mongoose');
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    planId: {
        type: String,
        required: true,
        uppercase: true,  // Convert to uppercase because stock symbols are typically uppercase
        trim: true        // Remove any whitespace
    },
    planPrice: {type: Number},
    planType: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: String,
        required: true,
    },
    razorpay_order_id: {
        type: String
    },
    razorpay_payment_id: {
        type: String
    },
    planPurchasedAt: {type: Date, default: moment.tz('UTC').toDate()},
});


// Compile the schema into a model and export it
const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
