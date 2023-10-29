const mongoose = require("mongoose")

const StoreSchema = new mongoose.Schema({
    //Dados pessoais
    razao_social: {
        type: String,
        required: true
    },
    cnpj:{
        type: String,
        required: true,
        unique: true
    },
    nome_fantasia:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    telefone:{
        type: String,
        required: false
    },
    celular: {
        type: String,
        required: true
    },
    //Endereço
    cep:{
        type: String,
        required: true
    },
    logradouro:{
        type: String,
        required: true
    },
    numero:{
        type: Number,
        required: true
    },
    bairro:{
        type: String,
        required: true
    },
    cidade:{
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    complemento:{
        type: String,
        required: false
    },
    created_at:{
        type: Date,
        default: new Date()
    }
}, {versionKey: false})

module.exports = mongoose.model("Store", StoreSchema)