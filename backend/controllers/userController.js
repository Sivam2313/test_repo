const asyncHandler = require('express-async-handler');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const authUser = asyncHandler(async(req,res)=>{
    console.log(req.body);
    const{email,password} = req.body;
    if(!email || !password){
        // console.log(email,password);
        res.sendStatus(404);
    }
    const user = await User.findOne({email:email})
    if(user){
        // console.log(user);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(passwordMatch){
            const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
                expiresIn: '30d',
            });
            
            res.status(201).json({"access":token});
        }
        else    
            res.status(400).json({email:'error'})
    return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        email,
        password: hashedPassword,
    })
    if(newUser){
        const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });
        res.status(201).json({"access":token});
    }
    else{
        throw new Error ('error')
    }

})

module.exports = {authUser};