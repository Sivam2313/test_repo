const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');
const cors = require('cors');
const path = require('path');

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
connectDB()
app.use(cors());
app.use(express.json())
app.use('/task',require('./routes/taskRouter'));
app.use('/user',require('./routes/userRouter'));

const __dirname1 = path.resolve();

if(process.env.Node_Env=='production'){
    app.use(express.static(path.join(__dirname1,'./frontend/build')));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"./frontend/build/index.html"))
    })
}
else{
    
    app.get('/',(req,res)=>{
        res.send('ok');
    })
}

app.listen(PORT,console.log("server at "+PORT));