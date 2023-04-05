const express = require("express")
const {followModel}=require("../models/followers.Model")
const followRouter = express.Router()

followRouter.get("/", async (req, res) => {
    try {
      const users = await followModel.find({});
      res.status(200).send(users);
    } catch (err) {
      res.status(400).send({ "msg": err.message });
    }
  });

followRouter.post("/add", async(req,res)=>{
    try{
    const note=new followModel(req.body)
    await note.save()
    res.status(200).send({"Msz":"A New follower has been added"})
    }catch(err){
        res.status(400).send({"msz":"Wrong Token",err})
    }
})

module.exports={
    followRouter
}