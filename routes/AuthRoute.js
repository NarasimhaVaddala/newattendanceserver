const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../modals/userModal');
const otp = require('../modals/otpModal');
const otpModal = require('../modals/otpModal');
const userModal = require('../modals/userModal');
const jwt = require('jsonwebtoken')
const SECRET = "@Inteli59400F@Amdr53600"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });



router.post("/sendotp", async (req, res) => {
    try {
        const { mobile, type } = req.body;
        const ifUser = await userModal.findOne({ mobile })
        console.log(ifUser);

        if (ifUser && type == "new") return res.status(201).send({ message: "user already exists" })

        const otp = "123456";
        const data = await otpModal.create({
            mobile,
            otp
        })
        return res.status(200).send({ message: "Otp Sent Successfully" })
    } catch (error) {
        return res.status(500).send(error);
    }
})


router.post('/verifyotp', async (req, res) => {
    try {
        const { mobile, otp } = req.body;
        const data = await otpModal.findOne({ mobile });
        if (data.otp !== otp) {
            return res.status(401).send({ message: "Otp Doesnot Match" })
        }
        await otpModal.deleteOne({ mobile })
        return res.status(200).send({ message: "Otp Verified success" })
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
            joinDate: new Date().toDateString()
        });
        await newUser.save();
        console.log(newUser);
        return res.status(200).json({ message: 'User signed up successfully' });
    } catch (error) {
        return res.status(500).send(error);
    }
});




router.post('/login', async (req, res) => {
    try {
        const { userId, password } = req.body;
        const userData = await userModal.findOne({
            $or: [
                { email: userId },
                { mobile: userId },
                { empId: userId }
            ]
        });

        if (!userData) return res.status(404).send({ message: "user not found" })
        if (userData.password != password) return res.status(401).send({ message: "invalid credentials" })
        const token = await jwt.sign({ _id: userData._id }, SECRET);
        return res.status(200).send({ token });

    }
    catch (error) {
        console.log(error);

        return res.status(500).send(error);
    }
})


router.post('/forgotpassword', async (req, res) => {
    try {

        const {userId, newPassword} = req.body;
        const userData = await userModal.findOneAndUpdate(
            {
                $or: [
                    { email: userId },
                    { mobile: userId },
                    { empId: userId }
                ]
            },
            {
                $set: { password: newPassword } 
                        },
            { new: true }
        );

        if (!userData) return res.status(404).send({ message: "user not found" })
        return res.status(200).send({ message: "password changed successfully" })




    } catch (error) {
        console.log(error);

        return res.status(500).send(error);
    }
})





module.exports = router;
