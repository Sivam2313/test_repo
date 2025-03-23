const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
},{
    timestamp:true,
})

const Users = mongoose.model('User',userSchema);
module.exports = Users;