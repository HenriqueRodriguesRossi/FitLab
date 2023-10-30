const Suplement = require("../models/Suplements")
const yup = require("yup")
const captureErrorYup = require("../utils/captureErrorYup")

exports.newSuplement = async (req, res)=>{
    try{
        const {store_id} = req.params

        const {name, quantity_in_stock, value, photo} = req.body

        const {file} = req.file
    }catch(error){
        if(error instanceof yup.ValidationError){
            const errors = [captureErrorYup(error)]

            return res.status(422).send({
                mensagem: "Erro ao cadastrar suplemento!",

                erros: errors
            })
        }else{
            console.log(error)

            return res.status(500).send({
                mensagem: "Erro ao cadastrar suplemento!"
            })
        }
    }
}