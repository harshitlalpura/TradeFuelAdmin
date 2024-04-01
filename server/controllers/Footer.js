const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const moment = require("moment-timezone");
const {getNextSequence} = require("mongodb-autoincrement");
const Footer = require("../models/Footer");
require('dotenv').config();


exports.saveFooter = async (req, res) => {
    try {

        const footerData = req.body.data;

        const footer = new Footer(footerData);
        await footer.save();
        res.status(200).json({message: 'Data added successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.fetchAllFooter = async (req, res) => {

    try {
        const footer = await Footer.find()
            .sort({ footer_created_at: -1 });


        // res.json(footer);
        res.status(200).json({ data: footer});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateFooter = async (req, res) => {
    try {
        const footerData = req.body.data;
        console.log(">>>", req.body.data)
        const updateFooter = await Footer.findByIdAndUpdate(footerData._id, req.body.data, {new: true});

        if (!updateFooter) {
            return res.status(404).json({error: 'Record not found'});
        }

        res.status(200).json({message: 'Record updated successfully', data: updateFooter});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};