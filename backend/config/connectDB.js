const mongoose = require('mongoose');

const connectDB = async ()=>{
    try {
        const connection = mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log("connected!!!");

    } catch (error) {
        console.log("failed to connect" + error.messsage);
        process.exit();
    }
}

module.exports = connectDB;