const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file



const moment = require('moment-timezone');


const LearnCategoriesSchema = new mongoose.Schema({
    learn_cat_name: {type: String, required: true},
    learn_cat_trash: {type: Boolean, default: false},
});


LearnCategoriesSchema.pre('save', async function (next) {

    next();
});

const LearnCategories = mongoose.model('learnCategories', LearnCategoriesSchema);
module.exports = LearnCategories;
