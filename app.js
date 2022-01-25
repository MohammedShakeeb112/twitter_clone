const express = require('express');
const app = express();
const port = 5000;
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./database');
const session = require('express-session');

const server = app.listen(port, () =>{
    console.log('Server running at port '+ port);
});

app.set('view engine', 'pug');  //view engine => application setting, pug => using pug file 
app.set('views', 'view'); // views=> how user see, view => directory of file 

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: "adventure",
    resave: true,
    saveUninitialized: false
}))

// using middleware to '/'route
const middleware = require('./middleware'); 
// Routes
const loginRoute = require('./routes/loginRoute');
const registerRoute = require('./routes/registerRoute');
const logoutRoute = require('./routes/logoutRoute');

// apiRoutes
const postApiRoute = require('./routes/api/posts');

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/logout', logoutRoute);

app.use('/api/posts', postApiRoute)

app.get('/', middleware.loginCheck, (req, res, next) => {  //next => middleware
    // res.status(200).send('<h1>Welcome to Root Page</h1>');
    // console.log('Server');
// after including pug file
    // res.status(200).render('home');
// rendering dynamic page title
    var payload = {
        pageTitle : 'Home',
        userLoggedIn: req.session.user
    }
    res.status(200).render('home', payload)
});