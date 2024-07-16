const express = require('express');
const layout = require('express-ejs-layouts');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Set up middleware
app.use(layout);
app.use(bodyParser());
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public'))); // Update path to correctly reach 'public' directory

// Set view engine and views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Define routes
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

// Start the server
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
