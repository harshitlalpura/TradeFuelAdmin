const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const moment = require('moment-timezone');


const WalletSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    wallet_amount: { type: Number, required: true, default: 5000 },
    wallet_created_at: { type: Date, default: Date.now },
    wallet_trash: { type: Boolean, default: false },
    remarks: { type: String }
});


WalletSchema.pre('save', async function (next) {
    next();
});

const Wallet = mongoose.model('wallet', WalletSchema);
module.exports = Wallet;
