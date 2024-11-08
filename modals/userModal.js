const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    name:String,
    mobile:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    empId:{
        type:String,
        unique:true
    },
    password:String,
    image:String,
    role:String,
    joinDate:String,
    roleType:String,

})


module.exports  = mongoose.model('users' , schema)