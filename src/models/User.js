const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    full_name:{
        type: String,
        required: true
    },
    cpf:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        default: new Date()
    }
}, {versionKey: false})

module.exports = mongoose.model("User", UserSchema)