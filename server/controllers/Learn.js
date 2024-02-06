const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const moment = require("moment-timezone");
const {getNextSequence} = require("mongodb-autoincrement");
const Learn = require("../models/Learn");
require('dotenv').config();


exports.saveLearn = async (req, res) => {

    try {
        const learnData = JSON.parse(req.body.data);

        var image_file = "";

        if (req.file && req.file.filename.length > 0) {
            image_file = req.file.filename;
            console.log("FILE FOUND");


        } else if (learnData.learn_image && learnData.learn_image.length > 0) {
            image_file = learnData.learn_image;

            console.log("FILE NOT FOUND " + learnData.learn_image);
        }

        learnData.learn_image = image_file;

        const learn = new Learn(learnData);
        await learn.save();
        res.status(200).json({message: 'Learn created successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateLearn = async (req, res) => {
    try {

        const learnData = JSON.parse(req.body.data);


        console.log(learnData);

        var image_file = "";

        if (req.file && req.file.filename.length > 0) {
            image_file = req.file.filename;
            console.log("FILE FOUND");


        } else if (learnData.learn_image && learnData.learn_image.length > 0) {
            image_file = learnData.learn_image;

            console.log("FILE NOT FOUND " + learnData.learn_image);
        }

        learnData.learn_image = image_file;


        const updateLearn = await Learn.findByIdAndUpdate(learnData._id, learnData, {new: true});

        if (!updateLearn) {
            return res.status(404).json({error: 'Learn not found'});
        }

        res.status(200).json({message: 'Learn updated successfully', learn: updateLearn});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.fetchAllLearn = async (req, res) => {

    try {
        const learn = await Learn.find({ learn_trash: false })
            .sort({ learn_created_at: -1 })
            .populate('learn_category', 'learn_cat_name');

        //console.log(learn);

        res.json(learn);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.deleteLearn = async (req, res) => {
    try {
        const learn = await Learn.findByIdAndUpdate(req.body.learn_id, {learn_trash: true}, {new: true});
        res.json(learn);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.fetchLearn = async (req, res) => {
    try {
        const learn = await Learn.findById(req.body.learn_id);


        res.json(learn);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
