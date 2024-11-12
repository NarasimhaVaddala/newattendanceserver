const express = require('express');
const isLogin = require('../middleware/isLogin');
const userModal = require('../modals/userModal');
const AttendanceModal = require('../modals/AttendanceModal');
const router = express.Router();
const getTimeDifference = require('../middleware/timeFormat');

router.post('/add', isLogin, async (req, res) => {
    try {
        const { checkIn } = req.body;
        const user = await userModal.findOne({ _id: req.user });
        if (!user) return res.status(404).send({ message: "User not found" });
        
        // Check if there is already a check-in for today
        const todayDate = new Date().toLocaleDateString();
        const existingAttendance = await AttendanceModal.findOne({
            user: req.user,
            date: todayDate
        });
        
        if (existingAttendance) {
            return res.status(400).send({ message: "Already checked in today" });
        }
        
        const { name, empId, _id } = user;
        const doc = { name, empId, checkIn, date: todayDate, user: _id };
        const addedAttendance = await AttendanceModal.create(doc);
        
        return res.status(200).send(addedAttendance);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.put('/end/:id', isLogin, async (req, res) => {
    try {
        const { checkOut } = req.body;

        // Find today's attendance for the user
        const todayDate = new Date().toLocaleDateString();

        console.log(req.params.id);
        
        const existingAttendance = await AttendanceModal.findOne({
            _id: req.params.id,
            user: req.user,
            date: todayDate
        });

        if (!existingAttendance) {
            return res.status(404).send({ message: "Attendance record not found" });
        }

        if (existingAttendance.checkOut) {
            return res.status(400).send({ message: "Already checked out today" });
        }

        const noOfHours = getTimeDifference(existingAttendance.checkIn, checkOut);
        const endAttendance = await AttendanceModal.findByIdAndUpdate(
            req.params.id,
            { $set: { checkOut, noOfHours } },
            { new: true }
        );

        return res.status(200).send({ message: "Attendance ended successfully", endAttendance });
    } catch (error) {
        console.log(error);
        
        return res.status(500).send({ message: error.message });
    }
});

router.get('/today', isLogin, async (req, res) => {
    try {
        const todayDate = new Date().toLocaleDateString();
        const userToday = await AttendanceModal.findOne({
            user: req.user,
            date: todayDate
        });
        
        if (!userToday) return res.status(404).send("Attendance not found today");
        return res.status(200).send(userToday);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

// Fetch attendance for a specific user
router.get('/userattendance', isLogin, async (req, res) => {
    try {
        const userId = req.user; 
        let attendanceRecords = await AttendanceModal.find({ user: userId })
            .populate('user', 'name empId'); // Populate user fields if needed

        // Sort attendance records by parsed date (assuming format is consistent, e.g., "MM/DD/YYYY")
        attendanceRecords = attendanceRecords.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        return res.status(200).json(attendanceRecords);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});


module.exports = router;


module.exports = router;
