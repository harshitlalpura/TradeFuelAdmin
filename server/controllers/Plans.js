const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const moment = require("moment-timezone");
const {getNextSequence} = require("mongodb-autoincrement");
const Plan = require("../models/Plans");
require('dotenv').config();


exports.savePlan = async (req, res) => {

    try {
        const planData =req.body;

        const plan = new Plan(planData);
        await plan.save();
        res.status(200).json({message: 'Subscription Plan created successfully.'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updatePlan = async (req, res) => {
    try {

        const planData = req.body;



        const updatePlan = await Plan.findByIdAndUpdate(planData._id, planData, {new: true});

        if (!updatePlan) {
            return res.status(404).json({error: 'Plan not found'});
        }

        res.status(200).json({message: 'Subscription Plan updated successfully.', plan: updatePlan});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.fetchAllPlans = async (req, res) => {

    try {
        const plan = await Plan.find({plan_trash: false}).sort({plan_created_at: -1});


        console.log(plan);

        res.json(plan);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.deletePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndUpdate(req.body.plan_id, {plan_trash: true}, {new: true});
        res.json(plan);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.fetchPlan = async (req, res) => {
    try {
        const plan = await Plan.findById(req.body.plan_id);


        res.json(plan);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
