const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userModal = require('../modals/userModal');
const isLogin = require('../middleware/isLogin')
const fs = require('fs')
// const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/getuser' , isLogin,async(req,res)=>{
    try {
            const user = await userModal.findOne({_id:req.user});
            if (!user) return res.status(404).send({message:"user not found"}) 
            const { password: _, ...userWithoutPassword } = user.toObject();        
            return res.status(200).send(userWithoutPassword);
         
    } catch (error) {
        return res.status(500).send(error.message)
    }
})







router.put("/editprofile", isLogin, upload.single("image"), async (req, res) => {
    try {
        // Find the user by ID
        const user = await userModal.findOne({ _id: req.user });
        if (!user) return res.status(404).send({ message: "User not found" });
        console.log(user);

        const updatedFields = { ...req.body };

        console.log("before file");
        
        // If a new image is uploaded
        if (req.file) {
            // Delete the old image file if it exists
            if (user.image) {
                const oldImagePath = path.join(__dirname, "../", user.image);
                fs.access(oldImagePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(oldImagePath, (err) => {
                            if (err) console.error("Error deleting old image:", err);
                        });
                    }
                });
            }

            // Update the new image path with '/uploads/' prefix
            updatedFields.image = `/uploads/${req.file.filename}`;
        }

        console.log("upto file");
        
        // Update user profile, keeping other fields unchanged
        const updatedUser = await userModal.findByIdAndUpdate(
            req.user,
            { $set: updatedFields },
            { new: true, runValidators: true }
        );

        console.log(updatedUser);

        res.send({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});



module.exports = router;