const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../modals/userModal');
const otp = require('../modals/otpModal');
const otpModal = require('../modals/otpModal');
const userModal = require('../modals/userModal');
const jwt = require('jsonwebtoken')
const isLogin = require('../middleware/isLogin')


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




module.exports = router;