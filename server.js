const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000 ;

//creating a custom middleware for logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

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

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'webviews','404.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));