const mongoose = require("mongoose")
const mongoUri = process.env.MONGO_URI

mongoose.connect(mongoUri)

const connection = mongoose.connection

connection.on("error", (error)=>{
    console.log("Erro ao conectar: " + error)
})

connection.on("open", ()=>{
    console.log("Conectado com sucesso!")
})

module.exports = mongoose