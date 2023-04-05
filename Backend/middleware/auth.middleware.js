const jwt=require("jsonwebtoken")

const auth=(req,res,next)=>{
    const token=req.headers.authorization
    if(token){
       const decoded= jwt.verify(token,'masai')
       if(decoded){
        console.log(decoded)
        req.body.userID=decoded.userID
        next()
       }else{
        res.status(400).send({"Msz":"Plz Login First"})
       }
    }else{
        res.status(400).send({"msz":"Didn't Login"})
    }
}

module.exports={
    auth
}