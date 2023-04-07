const express = require("express");
const userRouter = express.Router();
const { UserModel } = require('../models/userModel');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// User registration route
userRouter.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { username, email, password, mobileNum, interests } = req.body;
  const profilePicture = req.file ? req.file.path : null;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 5);

    // Create a new user object with the hashed password and profile picture path (if available)
    const user = new UserModel({
      username,
      email,
      password: hashedPassword,
      mobileNum,
      interests,
      profilePicture
    });

    // Save the user to the database
    await user.save();

    // Send a success response
    res.status(200).send({ message: "Registration has been done!" });
  } catch (err) {
    // Send an error response if there was a problem with the registration process
    res.status(500).send({ message: "There was an error", err });
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

userRouter.get("/",async(req,res)=>{
  const token=req.headers.authorization
  const decoded=jwt.verify(token,"masai")
  try{
      if(decoded){
          const notes=await UserModel.find()
          res.status(200).send(notes)
      }
  } catch(err){
      res.status(400).send({"msg":err.message}) 
  }
})

// Update a User
userRouter.put("/update/:userID", upload.single("profilePicture"), async (req, res) => {
    const { userID } = req.params;
    const { username, email, password, mobileNum, interests } = req.body;
    try {
      const user = await UserModel.findByIdAndUpdate({_id: userID});
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (username) user.username = username;
      if (email) user.email = email;
      if (mobileNum) user.mobileNum = mobileNum;
      if (interests) user.interests = interests;
      if (req.file) {
        user.profilePicture = req.file.path;
      }
      if (password) {
        bcrypt.hash(password, 5, async (err, hash) => {
          if (err) {
            return res.status(500).json({ message: "Error updating password", err });
          }
          user.password = hash;
          await user.save();
          console.log(user);
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