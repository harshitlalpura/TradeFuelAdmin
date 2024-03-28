const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const moment = require("moment-timezone");
const { getNextSequence } = require("mongodb-autoincrement");
const Wallet = require("../models//Wallet");
const Users = require("../models/Users");
require("dotenv").config();

exports.walletSave = async (req, res) => {
  try {
    const { user_id,user_balance, remarks } = req.body; // Assuming you're passing these values in the request body
  
    if(user_balance){

        const result = await Users.updateOne(
            {_id: req.body.user_id},
            {$inc: {user_balance: (parseFloat(user_balance))}}  // Using $inc to decrement
        );
    }

    const saveWallet = new Wallet({
        user: user_id, 
        wallet_amount: user_balance,
        remarks:remarks
    });
    await saveWallet.save();
    res.status(200).json({success:true,message: 'User updated successfully.'});
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// // Controller function to get all coins
// exports.getAllCoins = async (req, res) => {
//     try {
//         const coins = await Coin.find();
//         res.status(200).json(coins);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Controller function to get a specific coin by ID
exports.getWalletById = async (req, res) => {
    console.log("abc>>", req.body)
    try {
        const wallet = await Wallet.find({
            user: req.body.user_id,
        }).sort({ wallet_created_at: -1 });
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        res.status(200).json(wallet);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};