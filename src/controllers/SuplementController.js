const Suplement = require("../models/Suplements")
const yup = require("yup")
const captureErrorYup = require("../utils/captureErrorYup")

exports.newSuplement = async (req, res) => {
    try {
        const { store_id } = req.params

        if (!store_id) {
            return res.status(400).send({
                mensagem: "Por favor, forneça o id da loja que deseja cadastrar o suplemento!"
            })
        }

        const { name, quantity_in_stock, unit_value } = req.body
        
        const { file } = req.file

        if(!file){
            return res.status(400).send({
                mensagem: "Uma foto do suplemento é obrigatória!"
            })
        }

        const SuplementSchema = yup.object.shape({
            name: yup.string().required("O nome do suplemento é obrigatório!"),
            quantity_in_stock: yup.number().required("A quantidade em estoque é obrigatória!"),
            unit_value: yup.number().required("O valor unitário é obrigatório!").typeError('O valor unitário deve ser um número')
                .test(
                    'is-decimal-2-places',
                    'O valor unitário deve ter exatamente duas casas decimais!',
                    (value) => /^-?\d+\.\d{2}$/.test(value)
                ),

        })

        await SuplementSchema.validate(req.body, { abortEarly: false })

        const nameSuplementValidate = await Suplement.findOne({
            name
        })

        if (nameSuplementValidate) {
            return res.status(422).send({
                mensagem: "Este suplemento já foi cadastrado!"
            })
        } else {
            const newSuplement = new Suplement({
                name,
                quantity_in_stock,
                unit_value,
                photo: file.path,
                store_id
            })

            await newSuplement.save()

            return res.status(201).send({
                mensagem: "Suplemento cadastrado com sucesso!",

                suplement_details: {
                    id: newSuplement._id,
                    photo: newSuplement.photo,
                    name: newSuplement.name,
                    unit_value: newSuplement.unit_value,
                }
            })
        }
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = [captureErrorYup(error)]

            return res.status(422).send({
                mensagem: "Erro ao cadastrar suplemento!",

                erros: errors
            })
        } else {
            console.log(error)

            return res.status(500).send({
                mensagem: "Erro ao cadastrar suplemento!"
            })
        }
    }
}

exports.findAllSuplements = async (req, res)=>{
    try{
      const {store_id} = req.params

      if(!store_id){
        return res.status(400).send({
            mensagem: "Por favor, forneça o id da loja!"
        })
      }else{
        const findAllSuplements = await Suplement.find({
            store_id: store_id,
        })

        if(!findAllSuplements || findAllSuplements.length == 0){
            return res.status(404).send({
                mensagem: "Nenhum produto encontrado!"
            })
        }else{
            return res.status(200).send({
                mensagem: "Busca efetuada com sucesso!",

                details:{
                    nome_do_suplemento: name,
                    valor: unit_value,
                    foto: photo
                }
            })
        }
      }
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao retornar os suplementos cadastrados!"
        })
    }
}