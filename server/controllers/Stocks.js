require('dotenv').config();

const axios = require('axios');
const moment = require("moment");

const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');

const Stocks = require("../models/Stocks");
const Portfolio = require("../models/Portfolio");
const Transactions = require("../models/Transactions");
const Users = require("../models/Users");

const unirest = require("unirest");
const cheerio = require("cheerio");


exports.fetchTopGainers = async (req, res) => {

    console.log("G");
    const url = "https://www.google.com/finance/markets/gainers?hl=en";
    const response = await unirest.get(url).header({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"})
    const $ = cheerio.load(response.body);
    let topGainers = [];
    $(".hyO8N .SxcTic").each((i, el) => {
        topGainers.push({
            stock_name: $(el).find(".ZvmM7").text(),
            price: $(el).find(".YMlKec").text(),
            change_in_price: $(el).find(".P2Luy").text(),
            change_in_percentage: $(el).find(".JwB6zf").text(),
            symbol: $(el).find('.COaKTb').text()
        })
    })

    res.status(200).json({status: 1, data: topGainers});

}

exports.fetchTopLosers = async (req, res) => {


    console.log("L");
    const url = "https://www.google.com/finance/markets/losers?hl=en";
    const response = await unirest.get(url).header({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"})
    const $ = cheerio.load(response.body);
    let topLosers = [];
    $(".hyO8N .SxcTic").each((i, el) => {
        topLosers.push({
            stock_name: $(el).find(".ZvmM7").text(),
            price: $(el).find(".YMlKec").text(),
            change_in_price: $(el).find(".P2Luy").text(),
            change_in_percentage: $(el).find(".JwB6zf").text(),
            symbol: $(el).find('.COaKTb').text()
        })
    })

    res.status(200).json({status: 1, data: topLosers});
}

exports.fetchIntradayDataDhan = async (req, res) => {

    var options1 = {
        method: 'post',
        url: process.env.DHAN_API_BASE_URL + 'charts/historical',
        headers: {
            'Content-Type': 'application/json',
            'access-token': process.env.DHAN_API_ACCESS_TOKEN // Replace with your actual token
        },
        data: {
            "symbol": req.body.index,
            "exchangeSegment": req.body.exchangeSegment,
            "instrument": req.body.instrument,
            "expiryCode": 0,
            "fromDate": moment.tz("Asia/Kolkata").subtract(1, 'weeks').format("YYYY-MM-DD"),
            "toDate": moment.tz("Asia/Kolkata").format("YYYY-MM-DD"),

        }
    }


    axios(options1)
        .then((response1) => {


            var options2 = {
                method: 'post',
                url: process.env.DHAN_API_BASE_URL + 'charts/intraday',
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': process.env.DHAN_API_ACCESS_TOKEN // Replace with your actual token
                },
                data: {
                    "securityId": req.body.securityId,
                    "exchangeSegment": req.body.exchangeSegment,
                    "instrument": req.body.instrument,
                }
            }


            axios(options2)
                .then((response2) => {

                    res.json({historical: response1.data, intraday: response2.data});
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        })
        .catch((error) => {
            console.error('Error:', error);
        });

};


exports.importBSEStocksCSV = async (req, res) => {

    let stocksToInsert = [];
    const csvFilePath = '/home/hashmedia/projects/tradefuel/public/BSE.csv';

    fs.createReadStream(csvFilePath)
        .pipe(csv({separator: ','}))
        .on('data', (row) => {
            const companyNameExists = stocksToInsert.some(stock => stock.companyName === row.companyName.trim());
            const companySymbolExists = stocksToInsert.some(stock => stock.stockSymbol === row.stockSymbol.trim());

            if (!companyNameExists && !companySymbolExists) {
                stocksToInsert.push({
                    exchange: row.exchange,
                    stockCode: Number(row.stockCode),
                    stockSymbol: row.stockSymbol,
                    companyName: row.companyName.trim()
                });
            }
        })
        .on('end', async () => {
            try {

                console.log(stocksToInsert.length);

                if (stocksToInsert.length > 0) {
                    await Stocks.insertMany(stocksToInsert);
                    console.log(`Inserted ${stocksToInsert.length} unique stocks.`);
                } else {
                    console.log('No unique stocks found to insert.');
                }

                res.json({status: 1});
            } catch (err) {
                console.error('Error inserting records:', err);
                res.json({status: 0});
            }
        });
}


exports.importNSEStocksCSV = async (req, res) => {
    let stocksToInsert = [];
    const csvFilePath = '/home/hashmedia/projects/tradefuel/public/NSE.csv';

    fs.createReadStream(csvFilePath)
        .pipe(csv({separator: ','}))
        .on('data', (row) => {
            const companyNameExists = stocksToInsert.some(stock => stock.companyName === row.companyName.trim());
            const companySymbolExists = stocksToInsert.some(stock => stock.stockSymbol === row.stockSymbol.trim());

            if (!companyNameExists && !companySymbolExists) {
                stocksToInsert.push({
                    exchange: row.exchange,
                    stockCode: Number(row.stockCode),
                    stockSymbol: row.stockSymbol,
                    companyName: row.companyName.trim()
                });
            }
        })
        .on('end', async () => {
            try {

                console.log(stocksToInsert.length);

                if (stocksToInsert.length > 0) {
                    await Stocks.insertMany(stocksToInsert);
                    console.log(`Inserted ${stocksToInsert.length} unique stocks.`);
                } else {
                    console.log('No unique stocks found to insert.');
                }

                res.json({status: 1});
            } catch (err) {
                console.error('Error inserting records:', err);
                res.json({status: 0});
            }
        });
}


exports.searchStock = async (req, res) => {
    try {
        const searchTerm = req.body.searchQuery;


        // Search in stockSymbol, companyName, and stockCode
        const stocks = await Stocks.find({
            $or: [
                {stockSymbol: new RegExp(searchTerm, 'i')}, // Case-insensitive search
                {companyName: new RegExp(searchTerm, 'i')}
            ]
        });

        res.status(200).json({status: 1, data: stocks});

    } catch (err) {
        res.status(500).json({error: "Internal server error"});
        console.error('Error while searching stocks:', err);
    }
}


exports.fetchTransactions = async (req, res) => {
    try {
        const user_id = req.body.user_id;

        console.log(req.body);


        // Search in stockSymbol, companyName, and stockCode
        Transactions.find({userId: user_id})
            .sort({createdAt: -1})  // -1 indicates descending order
            .then(transactions => {
                console.log("Transactions for user, sorted by descending createdAt:", transactions);
                res.status(200).json({status: 1, data: transactions});
            })
            .catch(err => {
                console.error("Error retrieving transactions:", err);
                res.status(200).json({status: 0, message: err.toString()});
            });


    } catch (err) {
        res.status(500).json({error: "Internal server error"});
        console.error('Error while searching stocks:', err);
    }
}

exports.fetchStockDetails = async (req, res) => {

    console.log(req.body);
    var options1 = {
        method: 'post',
        url: process.env.DHAN_API_BASE_URL + 'charts/historical',
        headers: {
            'Content-Type': 'application/json',
            'access-token': process.env.DHAN_API_ACCESS_TOKEN // Replace with your actual token
        },
        data: {
            "symbol": req.body.stockSymbol,
            "exchangeSegment": req.body.exchange + "_EQ",
            "instrument": "EQUITY",
            "expiryCode": 0,
            "fromDate": moment.tz("Asia/Kolkata").subtract(1, 'weeks').format("YYYY-MM-DD"),
            "toDate": moment.tz("Asia/Kolkata").format("YYYY-MM-DD"),

        }
    }

    axios(options1)
        .then((response1) => {


            var options2 = {
                method: 'post',
                url: process.env.DHAN_API_BASE_URL + 'charts/intraday',
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': process.env.DHAN_API_ACCESS_TOKEN // Replace with your actual token
                },
                data: {
                    "securityId": req.body.stockCode,
                    "exchangeSegment": req.body.exchange + "_EQ",
                    "instrument": "EQUITY",
                }
            }


            axios(options2)
                .then(async (response2) => {


                    const portfolio = await Portfolio.findOne({
                        userId: req.body.userId,
                        stockSymbol: req.body.stockSymbol
                    });

                    const users = await Users.findOne({_id: req.body.userId, user_trash: false});


                    res.json({
                        status: 1,
                        historical: response1.data,
                        intraday: response2.data,
                        portfolio: portfolio,
                        user: users
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        })
        .catch((error) => {
            console.error('Error:', error);
        });

};


exports.processTransaction = async (req, res) => {
    try {


        const portfolio = await Portfolio.findOne({
            userId: req.body.userId,
            stockSymbol: req.body.stockSymbol
        });

        const users = await Users.findOne({_id: req.body.userId, user_trash: false});

        var type = req.body.type;

        console.log(users);
        console.log(req.body);

        if (type == "B") {

            if (users.user_balance < (parseInt(req.body.quantity) * req.body.marketPrice)) {

                res.status(200).json({status: 0, message: "You don't have enough balance to purchase this stock."});
            } else {

                const result = await Users.updateOne(
                    {_id: req.body.userId},
                    {$inc: {user_balance: -((parseInt(req.body.quantity) * req.body.marketPrice))}}  // Using $inc to decrement
                );

                const updateResult = await Portfolio.updateOne(
                    {
                        userId: req.body.userId,
                        stockSymbol: req.body.stockSymbol,
                    },
                    {
                        $inc: {
                            quantity: parseInt(req.body.quantity),
                            totalInvested: (parseInt(req.body.quantity) * req.body.marketPrice)
                        },  // Increment the quantity.
                        $set: {stockSymbol: req.body.stockSymbol}  // Set stockSymbol (has no effect if document already exists).
                    },
                    {
                        upsert: true,
                        new: true// Insert a new document if it doesn't exist.
                    }
                );

                const newTransaction = new Transactions({
                    userId: req.body.userId,
                    transactionType: 'B',
                    stockSymbol: req.body.stockSymbol,
                    quantity: parseInt(req.body.quantity),
                    amount: (parseInt(req.body.quantity) * req.body.marketPrice) // e.g., $50 per stock
                });
                newTransaction.save()
                    .then(() => console.log("Transaction saved successfully!"))
                    .catch(err => console.error("Error saving transaction:", err));

                console.log(updateResult);
                res.status(200).json({status: 1, message: ""});
            }

        } else if (type == "S") {

            const result = await Users.updateOne(
                {_id: req.body.userId},
                {$inc: {user_balance: ((parseInt(req.body.quantity) * req.body.marketPrice))}}  // Using $inc to decrement
            );

            if (portfolio != null) {

                if (portfolio.quantity == parseInt(req.body.quantity)) {

                    const portfolio = await Portfolio.deleteOne({
                        userId: req.body.userId,
                        stockSymbol: req.body.stockSymbol
                    });

                } else {

                    const updateResult = await Portfolio.updateOne(
                        {
                            userId: req.body.userId,
                            stockSymbol: req.body.stockSymbol,
                        },
                        {
                            $inc: {
                                quantity: -parseInt(req.body.quantity),
                                totalInvested: -(parseInt(req.body.quantity) * req.body.marketPrice)
                            },  // Increment the quantity.
                            $set: {stockSymbol: req.body.stockSymbol}  // Set stockSymbol (has no effect if document already exists).
                        }
                    );

                    console.log(updateResult);

                }

                const newTransaction = new Transactions({
                    userId: req.body.userId,
                    transactionType: 'S',
                    stockSymbol: req.body.stockSymbol,
                    quantity: parseInt(req.body.quantity),
                    amount: (parseInt(req.body.quantity) * req.body.marketPrice) // e.g., $50 per stock
                });
                newTransaction.save()
                    .then(() => console.log("Transaction saved successfully!"))
                    .catch(err => console.error("Error saving transaction:", err));

                res.status(200).json({status: 1, message: ""});

            } else {

                res.status(200).json({status: 0, message: "You don't have this stock in your portfolio."});
            }

        }


    } catch (err) {
        res.status(500).json({error: "Internal server error"});
        console.error('Error while searching stocks:', err);
    }
}


exports.fetchIntradayData = async (req, res) => {

    var url = process.env.FMP_API_BASE_URL + 'historical-chart/1min/' + req.body.symbol + '?apikey=' + res.locals.stockAPIKey;


    console.log(url);
    axios(url)
        .then((response) => {


            var resp = response.data;

            var data = [];

            if (resp.length > 0) {

                var dt = moment(resp[0].date).format("YYYY-MM-DD");

                for (var i = 0; i < resp.length; i++) {

                    if (dt == moment(resp[i].date).format("YYYY-MM-DD")) {

                        data.push(resp[i]);
                    } else {
                        break;
                    }
                }
            }


            res.json({success: true, data: data});
        })
        .catch((error) => {
            console.error('Error:', error);
            res.json({success: false, error: error});
        });

};


exports.fetchCurrentPrice = async (req, res) => {

    var url = process.env.FMP_API_BASE_URL + 'quote/' + req.body.symbols + '?apikey=' + res.locals.stockAPIKey;


    console.log(url);
    axios(url)
        .then((response) => {

            res.json({success: true, data: response.data});

        })
        .catch((error) => {
            console.error('Error:', error);
            res.json({success: false, error: error});
        });

};
