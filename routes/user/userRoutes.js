const mongoose=require('mongoose')
const Router=require('express')
const user_middleware=require('../../middleware/user/user_middleware')
const User=require('../../schema/user')
const router=Router()
const jwt=require('jsonwebtoken')
const qr=require('../../schema/qr')
require('dotenv').config()


router.post('/signup', async function(req, res) {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const newUser = new User({
            username: username,
            email: email,
            password: password
        });

        const savedUser = await newUser.save();
        const token = jwt.sign(email, process.env.JWT_SECRET);

        return res.status(201).json({
            mssg: "new user created successfully!",
            token: token
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mssg: "Error creating user"
        });
    }
});



router.post('/verify', user_middleware, async function(req, res) {
    try {
        const url_token = req.headers.url_token;

        const newQr = await qr.findOne({
            token: url_token
        });

        console.log(url_token);

        if (newQr && newQr.expires >= Date.now()) {
            console.log(newQr._id);

            return res.json({
                Success: true,
                mssg: "successfully scanned the qr"
            });
        }

        return res.status(400).json({
            Success: false,
            mssg: "invalid qr"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            Success: false,
            mssg: "Internal server error"
        });
    }
});



module.exports=router