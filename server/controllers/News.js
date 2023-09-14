const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const moment = require("moment-timezone");
const {getNextSequence} = require("mongodb-autoincrement");
const News = require("../models/News");
const Users = require("../models/Users");
const fetch=require("node-fetch");
require('dotenv').config();


exports.saveNews = async (req, res) => {

    try {
        const newsData = JSON.parse(req.body.data);

        var image_file = "";

        if (req.file && req.file.filename.length > 0) {
            image_file = req.file.filename;
            console.log("FILE FOUND");


        } else if (newsData.news_image && newsData.news_image.length > 0) {
            image_file = newsData.news_image;

            console.log("FILE NOT FOUND " + newsData.news_image);
        }

        newsData.news_image = image_file;

        const news = new News(newsData);
        await news.save();

        //Notification Alert for News
        const users = await Users.find({}, 'user_notification_token');
        let notificationTokens = users.map(user => user.user_notification_token).reduce((acc, curr) => acc.concat(curr), []);
        notificationTokens = notificationTokens.filter((item, index) => notificationTokens.indexOf(item) === index);

        const message = {
            to: notificationTokens,
            sound: 'default',
            title: 'TradeFuel News',
            body: newsData.news_title
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        res.status(200).json({message: 'News created successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateNews = async (req, res) => {
    try {

        const newsData = JSON.parse(req.body.data);


        var image_file = "";

        if (req.file && req.file.filename.length > 0) {
            image_file = req.file.filename;
            console.log("FILE FOUND");


        } else if (newsData.news_image && newsData.news_image.length > 0) {
            image_file = newsData.news_image;

            console.log("FILE NOT FOUND " + newsData.news_image);
        }

        newsData.news_image = image_file;


        const updateNews = await News.findByIdAndUpdate(newsData._id, newsData, {new: true});

        if (!updateNews) {
            return res.status(404).json({error: 'News not found'});
        }

        res.status(200).json({message: 'News updated successfully', news: updateNews});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.fetchAllNews = async (req, res) => {

    try {
        const news = await News.find({news_trash: false}).sort({news_created_at: -1});


        console.log(news);

        res.json(news);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.deleteNews = async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.body.news_id, {news_trash: true}, {new: true});
        res.json(news);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.fetchNews = async (req, res) => {
    try {
        const news = await News.findById(req.body.news_id);


        res.json(news);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
