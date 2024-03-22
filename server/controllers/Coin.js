const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const moment = require("moment-timezone");
const { getNextSequence } = require("mongodb-autoincrement");
const Coin = require("../models/Coin");
const Users = require("../models/Users");
require("dotenv").config();

exports.coinSave = async (req, res) => {
  try {
    const { user_id, coin_type, amount } = req.body; // Assuming you're passing these values in the request body
    console.log((">>>", req.body))


    if(coin_type=="C"){

        const result = await Users.updateOne(
            {_id: req.body.user_id},
            {$inc: {user_coin: (parseFloat(req.body.amount))}}  // Using $inc to decrement
        );

    }else{
        const result = await Users.updateOne(
            {_id: req.body.user_id},
            {$inc: {user_coin: -parseFloat(req.body.amount)}}  // Using $inc to decrement
        );
    }

    const saveCoin = new Coin({
        user: user_id, 
        coin_type: coin_type,
        coin_amount: amount,
    });
    await saveCoin.save();
    res.status(200).json({success:true,message: 'Subscription Plan Purchased Successfully.'});
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller function to get all coins
exports.getAllCoins = async (req, res) => {
    try {
        const coins = await Coin.find();
        res.status(200).json(coins);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller function to get a specific coin by ID
exports.getCoinById = async (req, res) => {
    console.log(">>", req.body)
    try {
   
        

        const coin = await Coin.find({
            user: req.body.user_id,
         
        }) .sort({ coin_created_at: -1 });
        if (!coin) {
            return res.status(404).json({ error: 'Coin not found' });
        }
        res.status(200).json(coin);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};