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

const SuplementRouter = require("./routes/SuplementsRouter")
app.use(SuplementRouter)

app.listen(3000, ()=>{
    console.log("Server runing!")
})