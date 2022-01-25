const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');

app.use(bodyParser.urlencoded({extended:false}))

router.get('/', (req, res, next) => {
    Post.find()
    .populate('postedBy')
    .sort({'createdAt':-1})
    .then(results => res.status(200).send(results))
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
});

router.post('/', async (req, res, next) => {
    if (!req.body.content){
        // console.log("Content not sent with request");
        return res.sendStatus(400);
    }
    var postData = {
        content: req.body.content,
        postedBy: req.session.user
    }
    Post.create(postData)
    .then(async newPost => {
        var newPost = await User.populate(newPost, {path: 'postedBy'});
        // console.log('First Post');
        // console.log(newPost);
        res.status(201).send(newPost);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
    // res.status(200).send('It worked')
});

router.put('/:id/like', async (req, res, next) => {
    // console.log(req.params.id);
    var postId = req.params.id;
    var userId = req.session.user._id;
    // console.log("USERID",userId);
    // console.log('SERVER',postId, userId);
    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
    // user = req.session.user
    // console.log(user);
    // console.log(user.likes);
    // console.log(user.likes.includes(postId));
    var option = isLiked ? '$pull' : '$addToSet';      //addToSet used liking, pull used for unlike
    
    // insert user like
    req.session.user = await User.findByIdAndUpdate(userId, {[option]: {likes: postId}}, {new:true})
    .catch(err => {
        console.log('USER ERROR',err);
        res.sendStatus(400);
    })
    // console.log('isliked', isLiked);
    // console.log('option', option);
    // console.log('userid', userId);
    // console.log(postId, userId);
    // insert post like
    var post = await Post.findByIdAndUpdate(postId, {[option]: {likes: userId}}, {new: true})
    .catch(err => {
        console.log('POST ERROR',err);
        res.sendStatus(400);
    })
    console.log(post);
    
    // res.status(200).send('PUT REQUEST WORKED');
    res.status(200).send(req.session.user)
});

module.exports = router;