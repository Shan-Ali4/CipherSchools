const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNum: { type: Number },
    interests: [{ type: String }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Followers' }]
  },
  {
    versionKey : false
  });
userSchema.index({ email: 1 }, { unique: false });
const UserModel = mongoose.model("user", userSchema)
module.exports={
    UserModel
}