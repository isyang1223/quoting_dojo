// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
var moment = require('moment');
// exports.index = function (req, res) {
//     res.render('index', { moment: moment });
// }
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/basic_mongoose');
mongoose.Promise = global.Promise;


var QuoteSchema = new mongoose.Schema({
    name: { type: String, required: [true, "name needs to be at least 2 character"], minlength: 2 },
    quote: { type: String, required: [true, "quote needs to be at least a character"], minlength: 1 },
}, { timestamps: true });


// var UserSchema = new mongoose.Schema({
//     name: String,
//     age: Number
// })
mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'User'
var Quote = mongoose.model('Quote') // We are retrieving this Schema from our Models, named 'User'



// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function (req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering
            res.render('index');
})
// Add User Request 
app.get('/quotes', function (req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    Quote.find({}, function (err, quotes) {
        if (err) {
            console.log('error')
        }
        else {
            console.log(quotes)
            res.render('results', { quotes: quotes, moment: moment });
        }
    })
})
app.post('/add', function (req, res) {
    console.log("POST DATA", req.body);
    // create a new User with the name and age corresponding to those from req.body
    var quote = new Quote();
    quote.name = req.body.name
    quote.quote = req.body.quote
    
   
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    quote.save(function (err) {
        // if there is an error console.log that something went wrong!
        if (err) {
          
            res.render('index', {errors: quote.errors})
        }
            
         else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added a quote!');
            res.redirect('/quotes');
        }
    })
})
// Setting our Server to Listen on Port: 8000
app.listen(8000, function () {
    console.log("listening on port 8000");
})