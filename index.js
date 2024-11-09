const express = require("express")
const cors = require('cors')
const db = require('./db')
const app = express()
const authRoute = require("./routes/AuthRoute")
const userRoute = require("./routes/UserRoute")
const attendanceRoute = require("./routes/Attendanceroute")
const port = 7000




app.use(cors())
app.use(express.json());
app.use("/uploads", express.static("uploads"));



app.use("/auth" , authRoute)
app.use("/user" , userRoute)
app.use("/attendance" , attendanceRoute)

app.get('/' , (req,res)=>{
    return res.status(200).send({
        message:"Welcome to Employee Attendance Server"
    })
})



app.listen(port , ()=>{
    console.log("Server Listening on port 7000")    
})