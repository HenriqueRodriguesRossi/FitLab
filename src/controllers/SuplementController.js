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
            _id: store_id,
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

exports.findSuplementsByName = async (req, res)=>{
    try{
        const {nome} = req.body

        const findSuplementsByName = await Suplement.find({
            name: nome
        })

        if(findSuplementsByName.length == 0 || !findSuplementsByName){
            return res.status(404).send({
                mensagem: "Nunhum suplemento encontrado!"
            })
        }else{
            return res.status(200).send({
                details: {
                    nome: findSuplementsByName.name,
                    unit_value: findSuplementsByName.unit_value,
                    photo: findSuplementsByName.photo,
                    store_id: findSuplementsByName._id
                }
            })
        }
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao pesquisar os suplementos!"
        })
    }
}

exports.findSuplementsByQuantity = async(req, res)=>{
    try{
        const {store_id} = req.params
        const {quantity_in_stock} = req.body

        if(!store_id || !quantity_in_stock){
            return res.status(422).send({
                mensagem: "Forneça todas as informações necessárias!"
            })
        }else{
            const findSuplementsByQuantity = await Suplement.find({
                _id: store_id,

                quantity_in_stock
            })

            if(findSuplementsByQuantity.length == 0 || !findSuplementsByQuantity){
                return res.status(404).send({
                    mensagem: "Nenhum suplemento encontrado!"
                })
            }else{
                return res.status(200).send({
                    mensagem: "Sucesso!",

                    products_details: findSuplementsByQuantity
                })
            }
        }
    }catch(error){
        return res.status(500).send({
            mensagem: "Erro ao buscar os suplementos!"
        })
    }
}

exports.alterAmount = async(req, res)=>{
    try{
        const {suplement_id} = req.params
        const {new_amount} = req.body

        if(!suplement_id){
            return res.status(400).send({
                mensagem: "Por favor, forneça o id do suplemento!"
            })
        }else if(!new_amount){
            return res.status(400).send({
                mensagem: "Por favor, forneça a nova quantidade do suplemento!"
            })
        }

        const alterAmount = await Suplement.findByIdAndUpdate({
            _id: suplement_id,

            quantity_in_stock: new_amount
        })

        if(!alterAmount){
            return res.status(404).send({
                mensagem: "Nenhum suplemento encontrado!"
            })
        }else{
            return res.status(200).send({
                mensagem: "Quantidade alterada com sucesso!",

                details:{
                    suplement_name: alterAmount.name,
                    new_amount: alterAmount.quantity_in_stock
                }
            })
        }
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao alterar a quantidade!"
        })
    }
}

exports.alterValue = async (req, res)=>{
    try{
        const {suplement_id} = req.params
        const {new_value} = req.body

        if(!suplement_id){
            return res.status(400).send({
                mensagem: "Por favor, forneça o id do suplemento!"
            })
        }else if(!new_value){
            return res.status(400).send({
                mensagem: "Por favor, forneça o novo valor!"
            })
        }

        const alterValue = await Suplement.findByIdAndUpdate({
            _id: suplement_id,

            unit_value: new_value
        })

        if(!alterValue){
            return res.status(404).send({
                mensagem: "Nenhum suplemento encontrado!"
            })
        }else{
            return res.status(200).send({
                mensagem: "Valor alterado com sucesso!",

                details:{
                    suplement_name: alterAmount.name,
                    new_value: alterAmount.unit_value
                }
            })
        }
    }catch(error){
        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao alterar o valor do suplemento!"
        })
    }
}

exports.deleteSuplement = async (req, res)=>{
    try{
        const {suplement_id} = req.params

        if(!suplement_id){
            return res.status(400).send({
                mensagem: "Por favor, forneça o id do suplemento!"
            })
        }

        const deleteSuplement = await Suplement.findByIdAndDelete({
            _id: suplement_id
        })

        if(!deleteSuplement){
            return res.status(404).send({
                mensagem: "Nenhum suplemento encontrado!"
            })
        }else {
            return res.status(200).send({
                mensagem: "Suplemento excluído com sucesso!"
            })
        }
    }catch(error){
        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao excluir o suplemento!"
        })
    }
}

exports.findAll = async (req, res)=>{
    try{
        const findAll = await Suplement.find()

        if(!findAll){
            return res.status(404).send({
                mensagem: "Erro ao listar todos os suplementos!"
            })
        }else {
            return res.status(200).send({
                all_suplements:{
                    name: findAll.name,
                    foto: findAll.photo,
                    value: findAll.unit_value 
                }
            })
        }
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao listar todos os suplementos!"
        })
    }
}