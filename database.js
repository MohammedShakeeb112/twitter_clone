const mongoose = require('mongoose');
// mongoose.set('useNewUrlParser', true);      //used for depricated 
// mongoose.set('useUnifiedTopology', true);   //used for depricated
// mongoose.set('useFindAndModify', false);

class DataBase{
    constructor(){
        this.connect();
    }
    connect(){
        mongoose.connect("mongodb+srv://shakeeb:shakeeb.shak@cluster0.ohgzx.mongodb.net/twitterCloneDB?retryWrites=true&w=majority")
        .then(() =>{
            console.log("DATABASE CONNECTION SUCCESSFUL");
        })
        .catch((err) => {
            console.log("FAILED DATABASE CONNECTION");
        })
    }
}

module.exports = new DataBase();