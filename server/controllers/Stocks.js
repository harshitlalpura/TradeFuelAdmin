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

   // console.log("G");
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


    //console.log("L");
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

              //  console.log(stocksToInsert.length);

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
        //https://fmpcloud.io/api/v3/search?query=RELIANCE&limit=10&exchange=NSE&apikey=5b4ae5a2feea1ab3797342fd287cfc92

        var url = process.env.FMP_API_BASE_URL + 'search?query=' + searchTerm + '&limit=10&exchange=NSE&apikey=' + res.locals.stockAPIKey;


        console.log(url);
        axios(url)
            .then((response) => {

                console.log(response.data);
                res.json({success: true, data: response.data});

            })
            .catch((error) => {
                console.error('Error:', error);
                res.json({success: false, error: error});
            });


    } catch (err) {
        res.status(500).json({error: "Internal server error"});
        console.error('Error while searching stocks:', err);
    }
}


exports.fetchTransactions = async (req, res) => {
    try {
        const user_id = req.body.user_id;

    //    console.log(req.body);


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


exports.verifyWatchlist = async (req, res) => {

    const {stock_symbol, stock_name, userId} = req.body;

   // console.log(stock_symbol + " " + userId);

    const user = await Users.findOne({_id: userId, user_trash: false});


    // Check if the symbol already exists in the watchlist
    const symbolExists = user.user_watchlist.some(entry => entry.stock_symbol === stock_symbol);


    res.json({
        success: true,
        isInWatchList: symbolExists,

    });


};


exports.fetchStockDetails = async (req, res) => {

    const {symbol, name, userId} = req.body;

   // console.log(symbol + " " + userId);

    const user = await Users.findOne({_id: userId, user_trash: false});

    const portfolio = await Portfolio.findOne({
        userId: userId,
        stockSymbol: symbol
    });

    var url = process.env.FMP_API_BASE_URL + 'quote/' + symbol + '?apikey=' + res.locals.stockAPIKey;
    console.log(url);
    axios(url).then((response) => {

        res.json({
            success: true,
            portfolio: portfolio,
            data: response.data,
            user: user
        });

    }).catch((error) => {
        console.error('Error:', error);
        res.json({success: false, error: error});
    });


};


exports.processTransaction = async (req, res) => {
    try {


        const portfolio = await Portfolio.findOne({
            userId: req.body.userId,
            stockSymbol: req.body.symbol
        });

        const users = await Users.findOne({_id: req.body.userId, user_trash: false});

        var type = req.body.type;

        let price = parseFloat(req.body.price.replace("₹", ""));
        let avgPrice = 0;

        if (portfolio != null) {
            avgPrice = (portfolio.averagePrice + price) / 2;
        } else {
            avgPrice = price;
        }

        //console.log(users);
        //console.log(req.body);

        if (type == "B") {

            if (users.user_balance < (parseInt(req.body.quantity) * price)) {

                res.status(200).json({
                    success: false,
                    message: "You don't have enough balance to purchase this stock."
                });
            } else {

                const result = await Users.updateOne(
                    {_id: req.body.userId},
                    {$inc: {user_balance: -((parseInt(req.body.quantity) * price))}}  // Using $inc to decrement
                );

                const updateResult = await Portfolio.updateOne(
                    {
                        userId: req.body.userId,
                        stockSymbol: req.body.symbol,
                    },
                    {
                        $inc: {
                            quantity: parseInt(req.body.quantity),
                            totalInvested: (parseInt(req.body.quantity) * price)
                        },  // Increment the quantity.
                        $set: {
                            stockSymbol: req.body.symbol,
                            averagePrice: avgPrice,

                        }  // Set stockSymbol (has no effect if document already exists).
                    },
                    {
                        upsert: true,
                        new: true// Insert a new document if it doesn't exist.
                    }
                );

                const newTransaction = new Transactions({
                    userId: req.body.userId,
                    transactionType: 'B',
                    stockSymbol: req.body.symbol,
                    quantity: parseInt(req.body.quantity),
                    amount: (parseInt(req.body.quantity) * price) // e.g., $50 per stock
                });
                newTransaction.save()
                    .then(() => console.log("Transaction saved successfully!"))
                    .catch(err => console.error("Error saving transaction:", err));

                console.log(updateResult);
                res.status(200).json({success: true, message: ""});
            }

        } else if (type == "S") {

            const result = await Users.updateOne(
                {_id: req.body.userId},
                {$inc: {user_balance: ((parseInt(req.body.quantity) * price))}}  // Using $inc to decrement
            );

            if (portfolio != null) {

                if (portfolio.quantity == parseInt(req.body.quantity)) {

                    const portfolio = await Portfolio.deleteOne({
                        userId: req.body.userId,
                        stockSymbol: req.body.symbol
                    });

                } else {

                    const updateResult = await Portfolio.updateOne(
                        {
                            userId: req.body.userId,
                            stockSymbol: req.body.symbol,
                        },
                        {
                            $inc: {
                                quantity: -parseInt(req.body.quantity),
                                totalInvested: -(parseInt(req.body.quantity) * price)
                            },  // Increment the quantity.
                            $set: {stockSymbol: req.body.symbol}  // Set stockSymbol (has no effect if document already exists).
                        }
                    );

                    console.log(updateResult);

                }

                const newTransaction = new Transactions({
                    userId: req.body.userId,
                    transactionType: 'S',
                    stockSymbol: req.body.symbol,
                    quantity: parseInt(req.body.quantity),
                    amount: (parseInt(req.body.quantity) * price) // e.g., $50 per stock
                });
                newTransaction.save()
                    .then(() => console.log("Transaction saved successfully!"))
                    .catch(err => console.error("Error saving transaction:", err));

                res.status(200).json({success: true, message: ""});

            } else {

                res.status(200).json({success: false, message: "You don't have this stock in your portfolio."});
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

exports.toggleStockWatchList = async (req, res) => {

    const {stock_symbol, stock_name, userId} = req.body;


    const user = await Users.findById(userId);


    // Check if the symbol already exists in the watchlist
    const symbolExists = user.user_watchlist.some(entry => entry.stock_symbol === stock_symbol);


    if (!symbolExists) {
        // Add the new stock entry to the watchlist
        user.user_watchlist.push({stock_symbol, stock_name});

        // Save the user document with the updated watchlist
        await user.save();

        res.json({success: true, message: "Stock added to the watchlist."});
    } else {

        user.user_watchlist = user.user_watchlist.filter(entry => entry.stock_symbol !== stock_symbol);

        // Save the user document with the updated watchlist
        await user.save();

        res.json({success: true, message: "Stock removed from the watchlist."});
    }
};

exports.deleteStockFromWatchlist = async (req, res) => {
    const stockToRemoveSymbol = req.body.stock_symbol; // Replace with the symbol of the stock you want to remove

    const user = await Users.findById(userId);

    // Use the filter method to remove the stock with the specified symbol
    Users.user_watchlist = Users.user_watchlist.filter(stock => stock.stock_symbol !== stockToRemoveSymbol);

    // Save the user document
    Users.save((saveErr, savedUser) => {
        if (saveErr) {
            // Handle the save error
            res.json({success: false, message: saveErr.toString()});
        } else {
            // The stock has been added to the user's watchlist
            res.json({success: true, message: "Stock removed from the watchlist."});
        }
    });
};

exports.fetchWatchlist = async (req, res) => {

    try {

        const {userId} = req.body;
        // Use await with findById to fetch the user by ID
        const user = await Users.findById(userId);

        // Access the watchlist field to retrieve all watchlist entries
        const watchlist = user.user_watchlist;

        if (watchlist.length > 0) {
            const symbols = watchlist.map(entry => entry.stock_symbol);
            // Join the symbols into a comma-separated string
            const symbolString = symbols.join(',');

            var url = process.env.FMP_API_BASE_URL + 'quote/' + symbolString + '?apikey=' + res.locals.stockAPIKey;

            console.log(url);
            axios(url)
                .then((response) => {

                    res.json({success: true, data: response.data});

                })
                .catch((error) => {
                    console.error('Error:', error);
                    res.json({success: false, error: error});
                });

        } else {
            res.json({success: true, data: []});
        }

    } catch (error) {
        // Handle any errors that may occur during the database operation
        res.json({success: false, error: error.toString()});


    }
};


exports.fetchPortfolio = async (req, res) => {

    try {

        const {userId} = req.body;
        // Use await with findById to fetch the user by ID
        const portfolio = await Portfolio.find({
            userId: userId,
        });

       // console.log(portfolio);

        if (portfolio && portfolio.length > 0) {
            const symbols = portfolio.map(entry => entry.stockSymbol);
            // Join the symbols into a comma-separated string
            const symbolString = symbols.join(',');

            var url = process.env.FMP_API_BASE_URL + 'quote/' + symbolString + '?apikey=' + res.locals.stockAPIKey;

            console.log(url);
            axios(url)
                .then((response) => {

                    var data = response.data;


                    const totalPortfolio = calculatePortfolioValue(portfolio, data);


                    res.json({
                        success: true,
                        data: response.data,
                        portfolio: portfolio,
                        totalPortfolioValue: totalPortfolio.totalPortfolioValue,
                        totalPortfolioChange: totalPortfolio.totalPortfolioChange,
                    });

                })
                .catch((error) => {
                    console.error('Error:', error);
                    res.json({success: false, error: error});
                });

        } else {
            res.json({success: true, data: []});
        }

    } catch (error) {
        // Handle any errors that may occur during the database operation
        res.json({success: false, error: error.toString()});


    }
};

const calculatePortfolioValue = (portfolio, currentPosition) => {
    let totalPortfolioValue = 0;
    let totalPortfolioChange = 0;

    portfolio.forEach((portfolioItem) => {
        const matchingCurrentPosition = currentPosition.find(
            (currentItem) => currentItem.symbol === portfolioItem.stockSymbol
        );

        if (matchingCurrentPosition) {
            const positionValue = portfolioItem.quantity * matchingCurrentPosition.price;
            totalPortfolioValue += positionValue;
            totalPortfolioChange += (portfolioItem.quantity * matchingCurrentPosition.change);
        }
    });

    return {totalPortfolioValue, totalPortfolioChange};
};


exports.fetchTrandingStocks = async (req, res) => {

    var url = process.env.FMP_API_BASE_URL + 'stock-screener?limit=5&country=IN&isActivelyTrading=true&apikey=' + res.locals.stockAPIKey;
//https://fmpcloud.io/api/v3/stock-screener?limit=5&country=IN&isActivelyTrading=true&apikey=5b4ae5a2feea1ab3797342fd287cfc92

    console.log(url);
    axios(url)
        .then(async (response) => {

            let data = response.data;

            for (var i = 0; i < data.length; i++) {

                var url = process.env.FMP_API_BASE_URL + 'historical-chart/5min/' +data[i].symbol + '?apikey=' + res.locals.stockAPIKey;


                console.log(url);
                const response = await axios(url);

                var resp = response.data;
                var chart=[];
                if (resp.length > 0) {

                    var dt = moment(resp[0].date).format("YYYY-MM-DD");


                    for (var j = 0; j < resp.length; j++) {

                        if (dt == moment(resp[j].date).format("YYYY-MM-DD")) {

                           chart.push(resp[j]);
                        } else {

                            break;
                        }
                    }
                }
                data[i].chart=chart;

            }



            res.json({success: true, data: data});

        })
        .catch((error) => {
            console.error('Error:', error);
            res.json({success: false, error: error});
        });

};
