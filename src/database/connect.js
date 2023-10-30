const mongoose = require("mongoose")
const mongoUri = process.env.MONGO_URI

mongoose.connect(mongoUri)

const connection = mongoose.connection

connection.on("error", (error)=>{
     console.log("Error connecting: " + error)
})

connection.on("open", ()=>{
     console.log("Connected successfully!")
})

module.exports = mongoose