const express = require('express');
const isLogin = require('../middleware/isLogin');
const userModal = require('../modals/userModal');
const AttendanceModal = require('../modals/AttendanceModal');
const router = express.Router()
const getTimeDifference = require('../middleware/timeFormat')



router.post('/add' , isLogin , async(req,res)=>{
    try {
        const {checkIn} = req.body;
        const user = await userModal.findOne({_id:req.user});
        if(!user) return res.status(404).send({message:"user not found"})
        const {name , empId , _id} = user;
        const doc = {name , empId , checkIn , date:new Date().toLocaleDateString(), user:_id};
        const addedAttendance = await AttendanceModal.create(doc);
        console.log(addedAttendance);
        
        return res.status(200).send(addedAttendance)
        
    } catch (error) {
        return res.status(500).send(error.message)   
    }
})


router.put('/end/:id', isLogin, async (req, res) => {
    try {
        const { checkOut } = req.body;

        const existingAttendance = await AttendanceModal.findById(req.params.id);
        if (!existingAttendance) {
            return res.status(404).send({ message: "Attendance record not found" });
        }
        const noOfHours = getTimeDifference(existingAttendance.checkIn, checkOut);
        const endAttendance = await AttendanceModal.findByIdAndUpdate(
            req.params.id,
            { $set: { checkOut: checkOut, noOfHours: noOfHours } },
            { new: true }
        );

        console.log(endAttendance);
        return res.status(200).send({ message: "Attendance ended successfully", endAttendance });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
});


/*
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
*/


module.exports = router;