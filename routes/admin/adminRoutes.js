const mongoose=require('mongoose')
const Router=require('express')
const router=Router()
const crypto=require('crypto')
const qr=require('../../schema/qr')
const admin=require('../../schema/admin')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const verify_admin=require('../../middleware/admin/admin_middleware')

let dynamicQrInterval = null

router.get('/createdynamicqr',verify_admin,function(req,res){
    console.log('hi there')
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.write('data: Connected to event stream\n\n');

    if (dynamicQrInterval) {
        clearInterval(dynamicQrInterval)
    }

    dynamicQrInterval = setInterval(async function(){
        const token=crypto.randomBytes(32).toString("hex")
        console.log(token)
        const QR=new qr({token:token,expires:Date.now()+20000})
        await QR.save().then(function (){
            const message=JSON.stringify({token:token})
            res.write(`data:${message}\n\n`)
        })
    },20000)

    
})

router.post('/stopqr',verify_admin,function(req,res){
    if (dynamicQrInterval) {
        clearInterval(dynamicQrInterval)
        dynamicQrInterval = null
        console.log('Dynamic QR generation stopped')
        return res.status(200).json({message: 'Dynamic QR generation stopped'})
    }

    res.status(400).json({message: 'No active QR generation'})
})

router.post('/signup',function(req,res){
    const username=req.body.username
    const email=req.body.email
    const password=req.body.password

    const new_admin=new admin({
        username:username,
        email:email,
        password:password
    });
    new_admin.save().then(()=>{
        console.log('new admin created successfully')
        const created_jwt=jwt.sign(email,process.env.JWT_SECRET)
        res.status(201).json({
            success:true,
            token:created_jwt
        })
    })
})

module.exports=router