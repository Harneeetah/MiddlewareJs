const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler.js');
const PORT = process.env.PORT || 3000 ;


//creating a custom middleware for logging
app.use(logger);

//Cross origin resource sharing
const whitelist = ['https://www.google.com', 'http://127.0.0.1:5500', 'http://localhost:3000'];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

//There are built-in middleware.
app.use(express.urlencoded({extended : false}));

// built-in middleware for json files
app.use(express.json());

//built-in middleware for handling static files
 app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|index(.html)?', (req, res) => {
    // using (^/$|)- this ensures the address must have a '/' or end with index.html
    //using (.html)?- this makes adding .html optional in the web address
    // one method to direct the server to the file 
    //res.sendFile('./webviews/index.html', {root: __dirname});
    // An alternative to this is
    res.sendFile(path.join(__dirname, 'webviews','index.html'));
});

app.get('/newpage(.html)?', (req, res) => {
     res.sendFile(path.join(__dirname, 'webviews','newpage.html'));
});

app.get('/oldpage(.html)?', (req, res) => {
    // redirecting an oldpage to newpage
    res.redirect( 301,'newpage.html');
});

app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to log hello.html');
    next()
    // next() is used to call the next function in the chain
}, (req,res) => {
    res.send('Hello World');
});

//another way the fuction above can be written is 
 const one = (req, res, next) => {
    console.log('One');
    next()
 }

 const two = (req, res, next) => {
    console.log('Two');
    next()
 }

 const three = (req, res) => {
    console.log('Three');
    res.send('Done!');
    
 }

 app.get('/chain(.html)?', [one, two, three]);

 //handles all requests to web address
 app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));