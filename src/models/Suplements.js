const mongoose = require("mongoose")

const SuplementSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    quantity_in_stock:{
        type: Number,
        require: true
    },
    unit_value:{
        type: Number,
        required: true
    },
    photo:{
        type: String,
        required: true
    },
    store_id:{
        type: String,
        required: true
    },
    sotre_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store"
    },
    created_at:{
        type: Date,
        default: new Date()
    }
}, {versionKey: false})

module.exports = mongoose.model("Suplement", SuplementSchema)