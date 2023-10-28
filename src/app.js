const express = require("express")
const app = express()
require("dotenv").config()
require("./database/connect")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const UserRouter = require("./routes/UserRouter")
app.use(UserRouter)

const StoresRouter = require("./routes/StoresRouter")
app.use(StoresRouter)

app.listen(8080, ()=>{
    console.log("Server runing!")
})