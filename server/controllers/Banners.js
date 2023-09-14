const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
;
const Admins = require('../models/Banners');
const moment = require("moment-timezone");
const {getNextSequence} = require("mongodb-autoincrement");
const Banners = require("../models/Banners");
require('dotenv').config();





exports.saveBanner = async (req, res) => {

    try {
        const bannerData = JSON.parse(req.body.data);

        var image_file = "";

        if (req.file && req.file.filename.length > 0) {
            image_file = req.file.filename;
            console.log("FILE FOUND");


        } else if (bannerData.banner_image && bannerData.banner_image.length > 0) {
            image_file = bannerData.banner_image;

            console.log("FILE NOT FOUND " + bannerData.banner_image);
        }

        bannerData.banner_image = image_file;

        const banner = new Banners(bannerData);
        await banner.save();
        res.status(200).json({message: 'Banner created successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateBanner = async (req, res) => {
    try {

        const bannerData = JSON.parse(req.body.data);


        var image_file = "";

        if (req.file && req.file.filename.length > 0) {
            image_file = req.file.filename;
            console.log("FILE FOUND");


        } else if (bannerData.banner_image && bannerData.banner_image.length > 0) {
            image_file = bannerData.banner_image;

            console.log("FILE NOT FOUND " + bannerData.banner_image);
        }

        bannerData.banner_image = image_file;



        const updatedBanner = await Banners.findByIdAndUpdate(bannerData._id, bannerData, {new: true});

        if (!updatedBanner) {
            return res.status(404).json({error: 'Banner not found'});
        }

        res.status(200).json({message: 'Banner updated successfully', banner: updatedBanner});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.fetchBanners = async (req, res) => {
    try {
        const banners = await Banners.find({banner_trash: false});


        res.json(banners);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banners.findByIdAndUpdate(req.body.banner_id, {banner_trash: true}, {new: true});
        res.json(banner);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.fetchBanner = async (req, res) => {
    try {
        const banner = await Banners.findById(req.body.banner_id);




        res.json(banner);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
