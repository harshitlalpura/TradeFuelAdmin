const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const moment = require('moment-timezone');


const CoinSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    coin_type: {
        type: String,
        required: true
    },
    coin_amount: { type: Number, required: true, default: 0 },
    coin_created_at: { type: Date, default: moment.tz('UTC').toDate() },
    // coin_created_at: { type: Date, default: Date.now }, // Set default value to current date/time

    coin_trash: { type: Boolean, default: false },
    coin_remarks: {
        type: String // Add remarks field
    }
});


CoinSchema.pre('save', async function (next) {
    next();
});

const Coin = mongoose.model('coin', CoinSchema);
module.exports = Coin;
