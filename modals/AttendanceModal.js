const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name:String,
    empId:String,
    checkIn:String,
    checkOut:String,
    noOfHours:String,
    date:String,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
      },

})

module.exports = mongoose.model('attendances' , schema)
