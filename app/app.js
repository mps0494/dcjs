/* Dependencies */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');

/* Creating and running an express server */
const app = express(); // Initialise express
const PORT = 3000; // Specify a network port

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Provide Express with middleware
app.use(express.static(path.join(__dirname, 'public'))); // Specify the folder which holds static files
app.use(bodyParser.json()); // Parse input text to JSON
app.use(bodyParser.urlencoded({ extended: true })); // Ensure proper/safe URL encoding
app.use(multer({ storage: multer.memoryStorage({}) }).any()); // Configure multer to hold uploaded file data in memory
app.use(cookieParser());

// Mount routes to the express app
app.use(require('./routes/home_route'));
app.use(require('./routes/listing_route'));
app.use(require('./routes/login_route'));
app.use(require('./routes/search_route'));
app.use(require('./routes/profile_route'));
app.use(require('./routes/account_routes'));
app.use(require('./routes/quote_route'));

// Any URLs, except for the ones in the routers specified above, will trigger the Express Error Handler
app.get('*', (req, res, next) => {
    next(new Error('404'));
});

// Express Error Handler
app.use((error, req, res, next) => {
    if (error.message === '404') {
        res.status(404).send('404 Error - Page Not Found');
    } else if (error.message === '401') {
        res.status(401).send('401 Error - Unauthorized Access');
    } else if (error.message === '400') {
        res.status(400).send('400 Error - Bad Request');
    } else {
        console.log(error);
        res.status(500).send('An error has occured');
    }
    next();
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} at 'http://localhost:${PORT}' (CTRL + C to exit)`);
});
