const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');

app.set('view engine', 'pug');
app.set('views', 'view');
app.use(bodyParser.urlencoded({extended:false}));

router.get('/', (req, res, next) => {
    res.status(200).render('register');
});

router.post('/', async (req, res, next) => {
    // console.log(req.body);
    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;

    var payload = req.body;
    if (firstName && lastName && username && email && password){
        var user = await User.findOne({
            $or:[
                {username: username},
                {email: email}
            ]
        })
        // .then((user) => {
        //     console.log(user);
        // })
        .catch((err) => {
            console.log(err);
            payload.errMessage = "Something went wrong";
            res.status(200).render('register', payload);
        })
        // console.log(user);
        // console.log("WELCOME");
        
        // no user found
        if (user == null){
            var data = req.body;
            data.password = await bcrypt.hash(password, 10);
            User.create(data)
            .then((user) => {
                console.log(user);
                req.session.user = user
                return res.redirect('/');
            })
        }
        else{
            // user found
            if (email == user.email){
                payload.errMessage = "Email already in use";
            }
            else{
                payload.errMessage = "Username already in use";
            }
            res.status(200).render('register', payload);
        }
    }
    else{
        payload.errMessage = "Either field has Invalid value";
        res.status(200).render('register', payload);

    }
});

module.exports = router;