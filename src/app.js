const express = require("express")
const app = express()
require("dotenv").config()
require("./database/connect")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const UserRouter = require("./routes/UserRouter")
app.use(UserRouter)

app.listen(8080, ()=>{
    console.log("Server runing!")
})