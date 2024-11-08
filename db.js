const mongoose = require('mongoose')
const url = "mongodb://127.0.0.1:27017/attendancenew"
mongoose.connect(url).then(()=>console.log("Db Connected")).catch((e)=>console.log("Error connecting DB : ", e.message))