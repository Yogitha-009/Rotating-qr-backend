const mongoose=require('mongoose')

const adminSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String
})

const admin=mongoose.model('admin',adminSchema)

module.exports=admin