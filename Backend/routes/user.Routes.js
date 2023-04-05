const express = require("express")
const userRouter = express.Router()
const { UserModel } = require('../models/userModel')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

userRouter.post("/register", async (req, res) => {
    const {username, email, password, mobileNum, interests } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        bcrypt.hash(password, 5, async (err, hash) => {
            const user = new UserModel({username, email, password: hash, mobileNum, interests });
            await user.save();
            console.log(user);
            res.status(200).send({ msz: "Registration has been done!" });
        });
    } catch (err) {
        res.status(500).send({ msz: "There Is Err", err });
    }
});

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    res.status(200).send({ "msg": "Login successfull!", "token": jwt.sign({ "userID": user._id }, "masai") })
                } else {
                    res.status(400).send({ "msg": "Wrong Credentials" })
                }
            });
        } else {
            res.status(400).send({ "msg": "User not found" })
        }
    } catch (err) {
        res.status(400).send({ "msg": err.message })
    }
})

// Update a User
userRouter.put("/update/:userID", async (req, res) => {
    const { userID } = req.params;
    const { username, email, password, mobileNum, interests } = req.body;
    try {
        const user = await UserModel.findById({_id:userID});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (username) user.username = username;
        if (email) user.email = email;
        if (mobileNum) user.mobileNum = mobileNum;
        if (interests) user.interests = interests;
        if (password) {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ message: "Error updating password", err });
                }
                user.password = hash;
                await user.save();
                res.status(200).json({ message: "User updated successfully" });
            });
        } else {
            await user.save();
            res.status(200).json({ message: "User updated successfully" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating user", err });
    }
});


module.exports = {
    userRouter
}