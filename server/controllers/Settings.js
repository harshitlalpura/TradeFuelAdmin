const moment = require("moment-timezone");
const {getNextSequence} = require("mongodb-autoincrement");
const Settings = require("../models/Settings");
const Admins = require("../models/Admins");
const aes256 = require("aes256");
const Users = require("../models/Users");
const Transactions = require("../models/Transactions");
require('dotenv').config();


exports.fetchSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();


        if (settings != null) {
            res.json(settings);
        } else {
            res.json({});
        }

    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.fetchStockAPIKey = async (req, res) => {
    try {
        const settings = await Settings.findOne();

        if (settings != null) {
            return settings.stock_market_key;
        } else {
            return "";
        }

    } catch (error) {
        return ""
    }
}

exports.saveSettings = async (req, res) => {

    try {

        const settingsData = req.body.data;

        const settings = new Settings(settingsData);
        await settings.save();
        res.status(200).json({message: 'Settings created successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const settingsData = req.body.data;

        const updateSettings = await Settings.findByIdAndUpdate(settingsData._id, req.body.data, {new: true});

        if (!updateSettings) {
            return res.status(404).json({error: 'Settings not found'});
        }

        res.status(200).json({message: 'Settings updated successfully', settings: updateSettings});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
