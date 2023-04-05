const express=require("express")
const {connection}=require("./db")
const {userRouter}=require('./routes/user.Routes')
const {followRouter}=require("./routes/followers.Route")
const {auth}=require("./middleware/auth.middleware")
const cors=require("cors")
const app=express()
require("dotenv").config()

app.use(express.json())
app.use(cors())


app.use('/user',userRouter)
app.use(auth)
app.use('/followers', followRouter)
app.listen(process.env.port,async ()=>{
    try{
        await connection
        console.log("Connected With DB")
    }catch(err){
        console.log(err)
    }
    console.log(`Server is running at port ${process.env.PORT}`)
})