const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    name:{
        type:String,
        required:true,
    },
    priority:{
        type:Number,
        required:true,
    },
    startTime:{
        type:Date,
        required:true,
    },
    endTime:{
        type:Date,
        required:true,
    },
    status:{
        type:Number,
        required:true,
    },
    timeCompleted:{
        type:Date,
    }
},{
    timestamp:true,
})

const Tasks = mongoose.model('Task',taskSchema);
module.exports = Tasks;