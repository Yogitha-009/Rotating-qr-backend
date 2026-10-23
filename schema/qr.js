const mongoose=require('mongoose')
const qrSchema=mongoose.Schema({
    token:String,
    expires:{
        type:Date,
        required:true,
        expires:0
    }
})

const qr=mongoose.model('qr',qrSchema)
module.exports=qr