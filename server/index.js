const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('./controllers/Admins');
const user = require('./controllers/Users');
const plans = require('./controllers/Plans');
const feedback = require('./controllers/Feedbacks');
const settings = require('./controllers/Settings');
const stocks = require('./controllers/Stocks');
const banner = require('./controllers/Banners');
const news = require('./controllers/News');
const learn = require('./controllers/Learn');
const notification = require('./controllers/Notifications');
const notificationGroups = require('./controllers/NotificationGroups');
const learnCategories = require('./controllers/LearnCategories');
const Admins = require("./models/Admins");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const NodeCache = require('node-cache');


require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());
app.use('/dashboard', express.static(path.join(__dirname, '..', 'build')));
app.use('/login', express.static(path.join(__dirname, '..', 'build')));
app.use('/subscriptions', express.static(path.join(__dirname, '..', 'build')));
app.use('/plans', express.static(path.join(__dirname, '..', 'build')));
app.use('/createplan', express.static(path.join(__dirname, '..', 'build')));
app.use('/transactions', express.static(path.join(__dirname, '..', 'build')));
app.use('/viewtransaction', express.static(path.join(__dirname, '..', 'build')));
app.use('/banners', express.static(path.join(__dirname, '..', 'build')));
app.use('/banner', express.static(path.join(__dirname, '..', 'build')));
app.use('/news', express.static(path.join(__dirname, '..', 'build')));
app.use('/managenews', express.static(path.join(__dirname, '..', 'build')));
app.use('/learn', express.static(path.join(__dirname, '..', 'build')));
app.use('/managelearn', express.static(path.join(__dirname, '..', 'build')));
app.use('/users', express.static(path.join(__dirname, '..', 'build')));
app.use('/profile', express.static(path.join(__dirname, '..', 'build')));
app.use('/admins', express.static(path.join(__dirname, '..', 'build')));
app.use('/notifications', express.static(path.join(__dirname, '..', 'build')));
app.use('/feedbacks', express.static(path.join(__dirname, '..', 'build')));
app.use('/admin', express.static(path.join(__dirname, '..', 'build')));
app.use('/settings/paymentgateway', express.static(path.join(__dirname, '..', 'build')));
app.use('/settings/stockmarket', express.static(path.join(__dirname, '..', 'build')));
app.use('/settings/contactus', express.static(path.join(__dirname, '..', 'build')));
app.use('/settings/maintenance', express.static(path.join(__dirname, '..', 'build')));

//app.use(express.static('build'));
app.use(express.static(path.join(__dirname, '..', 'build')));


app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));


const upload = multer({dest: 'uploads/'});
// Replace <your_mongodb_uri> with your actual MongoDB URI


//const mongoUri = "mongodb://tradefuel:password@68.178.170.233:27017/tradefuel";
const mongoUri = "mongodb://localhost:27017/tradefuel";
const SECRET_KEY = "3f3d3a8abf6011e227bc3c3d3a8abf6011e227bc3c3d3a8abf6011e227bc3c3d";
//const mongoUri = process.env.MONGODB_SERVER;
//const SECRET_KEY = process.env.SECRET_KEY;
mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true});

const myCache = new NodeCache({stdTTL: 100, checkperiod: 120});

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.admin_id = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({error: 'Unauthorized'});
    }
};


const cacheMiddleware = async (req, res, next) => {
    const cacheKey = "stockAPIKey";  // Use the request URL as a unique key

    const cachedData = myCache.get(cacheKey);
    console.log("CACHED: ", cachedData);
    if (cachedData) {
        res.locals.stockAPIKey = cachedData;
        next();// Store the cached data in res.locals
    } else {

        let apiKey = await settings.fetchStockAPIKey();
        if (apiKey != "") {
            res.locals.stockAPIKey = apiKey;
            console.log("API: ", apiKey);
            myCache.set(cacheKey, apiKey);
            next();
        } else {

            res.json({status: 0, message: "Stock API Key is not set. Please set API Key from settings."});
        }

    }

}

app.use('/fetchIntradayData', cacheMiddleware);
app.use('/fetchChart', cacheMiddleware);
app.use('/fetchCandleChart', cacheMiddleware);

app.use('/fetchCurrentPrice', cacheMiddleware);
app.use('/searchStock', cacheMiddleware);
app.use('/watchlist/fetch', cacheMiddleware);
app.use('/fetchStockDetails', cacheMiddleware);
app.use('/fetchPortfolio', cacheMiddleware);
app.use('/fetchTrandingStocks', cacheMiddleware);
app.use('/fetchWorldIndices', cacheMiddleware);

app.post('/fetchLeaderboardByEarnings', user.fetchLeaderboardByEarnings);
app.post('/fetchLeaderboardByVolume', user.fetchLeaderboardByVolume);
app.post('/fetchCurrentPrice', stocks.fetchCurrentPrice);
app.post('/fetchIntradayData', stocks.fetchIntradayData);
app.post('/fetchChart', stocks.fetchChart);
app.post('/fetchCandleChart', stocks.fetchCandleChart);

app.post('/fetchPortfolio', stocks.fetchPortfolio);
app.post('/fetchTrandingStocks', stocks.fetchTrandingStocks);
app.post('/fetchWorldIndices', stocks.fetchWorldIndices);


app.post('/fetchIntradayDataDhan', stocks.fetchIntradayData);
app.post('/fetchHistoricalData', stocks.fetchIntradayData);

app.post('/alert/set', stocks.setAlert);
app.post('/watchlist/toggle', stocks.toggleStockWatchList);
app.post('/watchlist/fetch', stocks.fetchWatchlist);
app.post('/watchlist/verify', stocks.verifyWatchlist);

app.get('/import/bse', stocks.importBSEStocksCSV);
app.get('/import/nse', stocks.importNSEStocksCSV);
app.post('/searchStock', stocks.searchStock);
app.post('/fetchStockDetails', stocks.fetchStockDetails);
app.post('/fetchAlerts', stocks.fetchAlerts);
app.post('/processTransaction', stocks.processTransaction);
app.post('/fetchTransactions', stocks.fetchTransactions);
app.get('/fetchTopGainers', stocks.fetchTopGainers);
app.get('/fetchTopLosers', stocks.fetchTopLosers);


app.post('/signin', admin.signIn);
app.get('/signup', admin.signUp);


app.get('/fetchAdmins', authenticate, admin.fetchAdmins);
app.post('/deleteAdmin', authenticate, admin.deleteAdmin);
app.post('/fetchAdmin', authenticate, admin.fetchAdmin);
app.post('/verifyAdminUsername', authenticate, admin.verifyAdminUsername);
app.post('/verifyAdminEmail', authenticate, admin.verifyAdminEmail);

var imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, '/Users/harshit/Documents/workspace/React/StockTradingAdmin/public/uploads/');
       // cb(null, '/home/hashmedia/projects/tradefuel/public/uploads/');
        //  cb(null, '/Users/manndave/Documents/Workspace/StockTradingAdmin/public/uploads/');
         cb(null, '/home/ubuntu/StockTradingAdmin/public/uploads/')
    },
    filename: function (req, file, cb) {

        cb(null, Date.now() + '-' + Math.floor(Math.random() * 90000) + path.extname(file.originalname));
    }
});

var imageUpload = multer({storage: imageStorage, limits: {fileSize: 10000000}});

var uploadImage = imageUpload.single('file');


app.post('/updateAdmin', (req, res) => {

    // File has been uploaded successfully


    uploadImage(req, res, function (err) {

        if (err) {

            var error = err.toString();

            if (err.code == "LIMIT_FILE_SIZE") {
                error = "Too large product image. Image size must not be greater than 10MB.";
            }

            res.status(400).json({message: error});

            // An unknown error occurred when uploading.
        } else {
            admin.updateAdmin(req, res);

        }
        // Everything went fine.
    });

});


app.post('/verifyPhone', (req, res) => {
    user.verifyPhone(req, res);
});

app.post('/verifyPhone', (req, res) => {
    user.verifyPhone(req, res);
});

app.post('/verifyOTP', (req, res) => {
    user.verifyOTP(req, res);
});


app.post('/updateNotificationToken', (req, res) => {
    user.updateNotificationToken(req, res);
});

app.post('/loginUser', (req, res) => {

    user.loginUser(req, res);

});

app.post('/saveUser', (req, res) => {

    // File has been uploaded successfully


    console.log('g');

    user.saveUser(req, res);


});

app.post('/saveFeedback', (req, res) => {

    // File has been uploaded successfully


    console.log('g');

    feedback.saveFeedback(req, res);


});


app.post('/updateUser', (req, res) => {

    // File has been uploaded successfully


    console.log('g');

    user.updateUser(req, res);


});

app.post('/saveAdmin', (req, res) => {

    // File has been uploaded successfully


    uploadImage(req, res, function (err) {

        if (err) {

            var error = err.toString();

            if (err.code == "LIMIT_FILE_SIZE") {
                error = "Too large product image. Image size must not be greater than 10MB.";
            }

            res.status(400).json({message: error});

            // An unknown error occurred when uploading.
        } else {
            admin.saveAdmin(req, res);

        }
        // Everything went fine.
    });

});


app.get('/fetchFeedbacks', authenticate, feedback.fetchFeedbacks);

app.get('/fetchBanners', authenticate, banner.fetchBanners);
app.get('/fetchSettings', authenticate, settings.fetchSettings);
app.post('/fetchBanner', authenticate, banner.fetchBanner);
app.post('/deleteBanner', authenticate, banner.deleteBanner);

app.post('/updateBanner', (req, res) => {

    // File has been uploaded successfully


    uploadImage(req, res, function (err) {

        if (err) {

            var error = err.toString();

            if (err.code == "LIMIT_FILE_SIZE") {
                error = "Too large product image. Image size must not be greater than 10MB.";
            }

            res.status(400).json({message: error});

            // An unknown error occurred when uploading.
        } else {
            banner.updateBanner(req, res);

        }
        // Everything went fine.
    });

});


app.post('/saveBanner', (req, res) => {

    // File has been uploaded successfully


    uploadImage(req, res, function (err) {

        if (err) {

            var error = err.toString();

            if (err.code == "LIMIT_FILE_SIZE") {
                error = "Too large product image. Image size must not be greater than 10MB.";
            }

            res.status(400).json({message: error});

            // An unknown error occurred when uploading.
        } else {
            banner.saveBanner(req, res);

        }
        // Everything went fine.
    });

});

app.get('/fetchAllVisitors', authenticate, user.fetchAllVisitors);

app.get('/fetchAllPlans', plans.fetchAllPlans);
app.post('/fetchPlan', authenticate, plans.fetchPlan);
app.post('/deletePlan', authenticate, plans.deletePlan);
app.post('/savePlan', authenticate, plans.savePlan);
app.post('/updatePlan', authenticate, plans.updatePlan);

app.post('/fetchTransactions', authenticate, user.fetchTransactions);
app.get('/fetchUsers', authenticate, user.fetchUsers);
app.post('/changeUserStatus', authenticate, user.changeUserStatus);
app.post('/deleteUser', authenticate, user.deleteUser);
app.post('/fetchUser', authenticate, user.fetchUser);

app.get('/fetchAllNews', news.fetchAllNews);
app.post('/fetchNews', authenticate, news.fetchNews);
app.post('/deleteNews', authenticate, news.deleteNews);
app.post('/updateNews', (req, res) => {

    // File has been uploaded successfully


    uploadImage(req, res, function (err) {

        if (err) {

            var error = err.toString();

            if (err.code == "LIMIT_FILE_SIZE") {
                error = "Too large product image. Image size must not be greater than 10MB.";
            }

            res.status(400).json({message: error});

            // An unknown error occurred when uploading.
        } else {
            news.updateNews(req, res);

        }
        // Everything went fine.
    });

});


app.post('/saveNews', (req, res) => {

    // File has been uploaded successfully


    uploadImage(req, res, function (err) {

        if (err) {

            var error = err.toString();

            if (err.code == "LIMIT_FILE_SIZE") {
                error = "Too large product image. Image size must not be greater than 10MB.";
            }

            res.status(400).json({message: error});

            // An unknown error occurred when uploading.
        } else {
            news.saveNews(req, res);

        }
        // Everything went fine.
    });

});

app.get('/fetchAllLearnCategories', learnCategories.fetchAllLearnCategories);
app.post('/saveLearnCategory', learnCategories.saveLearnCategory);

app.get('/fetchAllLearn', learn.fetchAllLearn);

app.post('/fetchLearn', learn.fetchLearn);
app.post('/deleteLearn', learn.deleteLearn);
app.post('/updateLearn', (req, res) => {

    // File has been uploaded successfully


    uploadImage(req, res, function (err) {

        if (err) {

            var error = err.toString();

            if (err.code == "LIMIT_FILE_SIZE") {
                error = "Too large product image. Image size must not be greater than 10MB.";
            }

            res.status(400).json({message: error});

            // An unknown error occurred when uploading.
        } else {
            learn.updateLearn(req, res);

        }
        // Everything went fine.
    });

});


app.post('/saveLearn', (req, res) => {

    // File has been uploaded successfully


    uploadImage(req, res, function (err) {

        if (err) {

            var error = err.toString();

            if (err.code == "LIMIT_FILE_SIZE") {
                error = "Too large product image. Image size must not be greater than 10MB.";
            }

            res.status(400).json({message: error});

            // An unknown error occurred when uploading.
        } else {
            learn.saveLearn(req, res);

        }
        // Everything went fine.
    });

});

app.post('/saveSettings', authenticate, settings.saveSettings);
app.post('/updateSettings', authenticate, settings.updateSettings);

app.post('/saveNotificationGroup', authenticate, notificationGroups.saveNotificationGroup);
app.post('/updateNotificationGroup', authenticate, notificationGroups.updateNotificationGroup);
app.get('/fetchAllNotificationGroups', notificationGroups.fetchAllNotificationGroups);

app.get('/fetchAllNotifications', notification.fetchNotifications);
app.post('/fetchNotification', notification.fetchNotification);
app.post('/deleteNotification', notification.deleteNotification);
app.post('/saveNotification', (req, res) => {

    // File has been uploaded successfully


    uploadImage(req, res, function (err) {

        if (err) {

            var error = err.toString();

            if (err.code == "LIMIT_FILE_SIZE") {
                error = "Too large product image. Image size must not be greater than 10MB.";
            }

            res.status(400).json({message: error});

            // An unknown error occurred when uploading.
        } else {
            notification.saveNotification(req, res);

        }
        // Everything went fine.
    });

});

app.get('/protected', authenticate, async (req, res) => {
    try {
        const admin = await Admins.findById(req.admin_id);
        res.json({message: `Hello ${admin.admin_email}`});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
