const mongoose=require('mongoose')
const Router=require('express')
const jwt=require('jsonwebtoken')
const router=Router()
const admin=require('../../schema/admin')
require('dotenv').config()

async function verify_admin(req,res,next){
    const jwt_token=req.headers.jwt;
    const jwt_verified_email=jwt.verify(jwt_token,process.env.JWT_SECRET);
    const found_admin=await admin.findOne({email:jwt_verified_email})
    try {
        if(found_admin){
            console.log('admin found')
            next()
        }
    } catch (error) {
        console.log("error occured will finding the admin",error)
    }
}

module.exports=router