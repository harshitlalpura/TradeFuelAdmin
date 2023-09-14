const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema({
    stockSymbol: {
        type: String,
        required: true,
        uppercase: true,  // Convert to uppercase because stock symbols are typically uppercase
        trim: true        // Remove any whitespace
    },
    exchange: {
        type: String,
        required: true,
        enum: ['NSE', 'BSE'], // You can expand this list as needed
        uppercase: true,
        trim: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    stockCode: {
        type: Number,
        required: true,
        unique: true
    }
});

// Create a unique compound index on stockSymbol and exchange.
// This ensures that a stockSymbol can exist in both NSE and BSE without conflict.
stockSchema.index({ stockSymbol: 1, exchange: 1 }, { unique: true });

// Compile the schema into a model and export it
const Stock = mongoose.model('Stock', stockSchema);
module.exports = Stock;
