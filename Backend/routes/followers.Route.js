const express = require("express")
const {followModel}=require("../models/followers.Model")
const followRouter = express.Router()

followRouter.get("/", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const results = {};
      if (endIndex < (await followModel.countDocuments().exec())) {
        results.next = {
          page: page + 1,
          limit: limit
        };
      }
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        };
      }
  
      results.results = await followModel
        .find()
        .limit(limit)
        .skip(startIndex)
        .exec();
  
      res.status(200).send(results);
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
followRouter.delete("/delete/:userID", async (req, res) => {
    let  { userID } = req.params
    try {
        await followModel.findByIdAndDelete({ _id: userID })
        res.send({ "message": "Deleted succesfully" })
    } catch (error) {
        res.send({ "error": "some error occured while deleting" })
    }
})
module.exports={
    followRouter
}