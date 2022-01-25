const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');


app.set('view engine', 'pug');
app.set('views', 'view');
app.use(bodyParser.urlencoded({extended:false}))

router.get('/', (req, res, next) => {
    var payload = {
        pageTitle : 'Login'
    }
    res.status(200).render('login', payload);
});

router.post('/', async (req, res, next) => {
    var payload = req.body
    if (req.body.usernameLog && req.body.passwordLog){
        var user = await User.findOne({
            $or:[
                {username: req.body.usernameLog},
                {email: req.body.usernameLog}
            ]
        })
        // .then((user) => {
        //     console.log(user);
        // })
        .catch((err) => {
            console.log(err);
            payload.errMessage = "Something went wrong";
            res.status(200).render('login', payload);
        })
        if (user != null){
            var result = await bcrypt.compare(req.body.passwordLog, user.password);
            // console.log(result);
            if (result === true){
                req.session.user = user;
                return res.redirect('/');
            }
        }
        payload.errMessage = "Credential Invalid";
        return res.status(200).render('login', payload);
    }
    payload.errMessage = "Either field is invalid";
    return res.status(200).render('login', payload);
})

module.exports = router;