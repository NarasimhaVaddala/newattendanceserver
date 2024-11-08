const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    mobile:String,
    otp:String,
})



module.exports  = mongoose.model('otp' , schema)