const mongoose = require('mongoose');

// Define the schema for the Portfolio collection
const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',  // assuming you have a User model
        required: true
    },
    transactionType: {
        type: String,
        required: true
    },
    stockSymbol: {
        type: String,
        required: false
    },
    quantity: {
        type: Number,
        required: false,
        default: 0
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
}, {
    timestamps: true  // this will automatically add createdAt and updatedAt fields
});

// Create the model from the schema
const Transactions = mongoose.model('Transactions', transactionSchema);

module.exports = Transactions;
