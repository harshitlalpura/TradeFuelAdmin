const mongoose = require('mongoose');

// Define the schema for the Portfolio collection
const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',  // assuming you have a User model
        required: true
    },
    stockSymbol: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    buyPrice: {
        type: Number,
        required: true,
        default: 0
    },
    averagePrice: {
        type: Number,
        required: true,
        default: 0
    },
    totalInvested: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true  // this will automatically add createdAt and updatedAt fields
});

// Create the model from the schema
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
