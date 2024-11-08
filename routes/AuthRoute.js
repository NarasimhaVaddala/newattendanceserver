const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../modals/userModal');
const otp = require('../modals/otpModal');
const otpModal = require('../modals/otpModal');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });



router.post("/sendotp" , async(req,res)=>{
    try {
        const {mobile} = req.body;
        const otp = "123456";
        const data = await otpModal.create({
            mobile,
            otp
        })
        return res.status(200).send({message:"Otp Sent Successfully"})
    } catch (error) {
        return res.status(500).send(error);
    }
})


router.post('/verifyotp', async(req,res)=>{
    try {
        const {mobile , otp} = req.body;
        const data = await otpModal.findOne({mobile});
        if (data.otp !== otp) {
            return res.status(401).send({message : "Otp Doesnot Match"})
        }
        await otpModal.deleteOne({mobile})
        return res.status(200).send({message:"Otp Verified success"})
    } catch (error) {
        return res.status(500).send(error);
    }
})


router.post('/signup', upload.single('image'), async (req, res) => {
    try {
        const { name, mobile, email, empId, password, role, roleType, joinDate } = req.body;


        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;


        const newUser = new User({
            name,
            mobile,
            email,
            empId,
            password,
            image: imageUrl,
            role,
            roleType,
            joinDate
        });


        await newUser.save();

        return res.status(201).json({ message: 'User signed up successfully', user: newUser });
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;
