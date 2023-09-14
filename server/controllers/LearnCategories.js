const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const moment = require("moment-timezone");
const {getNextSequence} = require("mongodb-autoincrement");
const LearnCategories = require("../models/LearnCategories");
require('dotenv').config();

exports.fetchAllLearnCategories = async (req, res) => {


    try {
        const learnCategories = await LearnCategories.find({learn_cat_trash: false});
        res.json(learnCategories);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.saveLearnCategory = async (req, res) => {

    try {
        const {learn_cat_name} = req.body;

        const newCategory = new LearnCategories({
            learn_cat_name: learn_cat_name,
        });

        const savedCategory = await newCategory.save();

        res.json(savedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
