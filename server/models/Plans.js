const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file



const moment = require('moment-timezone');


const PlanSchema = new mongoose.Schema({
    plan_name: {type: String, required: true},
    plan_discount: {type: String},
    plan_type: {type: String},
    plan_price:{type:Number},
    plan_features:{type:String},
    plan_created_at: {type: Date, default: moment.tz('UTC').toDate()},
    plan_trash: {type: Boolean, default: false},
});


PlanSchema.pre('save', async function (next) {

    next();
});

const Plans = mongoose.model('plans', PlanSchema);
module.exports = Plans;
