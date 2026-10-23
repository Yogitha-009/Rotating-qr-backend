const mongoose =require('mongoose')
const User=require('../../schema/user')
const jwt=require('jsonwebtoken')
require('dotenv').config()

async function user_middleware(req,res,next){

    const token = req.headers.token;
    const email = jwt.verify(token, process.env.JWT_SECRET);
    console.log(email)
    if(email){
        const user_with_email = await User.findOne({email: email});
        if(user_with_email){
            return next();
        }
    }

    return res.json({
        mssg:"user not found"
    });
}

module.exports=user_middleware