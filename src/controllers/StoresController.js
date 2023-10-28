const Store = require("../models/Store")
const yup = require("yup")
const captureErrorYup = require("../utils/captureErrorYup")
const bcrypt = require("bcryptjs")
const axios = require("axios")

exports.newStore = async(req, res)=>{
    try{
        const {razao_social, cnpj, nome_fantasia, email, telefone, celular, cep, logradouro, numero, bairro, cidade, estatdo, complemento} = req.body

        const StoreSchema = yup.object().shape({
            razao_social: yup.string().required("A razão social é obrigatório!"),
    
            cnpj: yup.string().required("O cnpj é obrigatório!").min(14, "O cnpj deve ter 14 caracteres!").max(14, "O cnpj deve ter 14 dígitos!"),
    
            nome_fantasia: yup.string().required("O nome fantasia é obrigatório!"),
            
            email: yup.string().required("O email é obrigatório!").email("Digite um email válido!"),
    
            telefone: yup.string().notRequired().min(8, "O telefone deve ter no mínimo 8 dígitos!").max(10, "O telefone de ter no máximo 10 caracteres!"),
    
            celular: yup.string().required("O celular é obrigatório!").min(9, "O celular deve ter no mínimo 9 caracteres!").max(11, "O celular deve ter no máximo 11 dígitos!"),
    
            cep: yup.string().required("O cep é obrigatório!").max(8, "O cep deve ter no máximo 8 caracteres").min(8, "O cep deve ter no mínimo 8 números!"),
    
            logradouro: yup.string().required("O logradouro é obrigatório!"),
    
            numero: yup.number().required("O número é obrigatório!"),
    
            bairro: yup.string().required("O bairro é obrigatório!"),
    
            cidade: yup.string().required("A cidade é obrigatória!"),
    
            estatdo: yup.string().required("O estado é obrigatório!"),
    
            complemento: yup.string().notRequired()
        })

        await StoreSchema.validate(req.body, {abortEarly: false})

        const validaRazaoSocial = await Store.findOne({razao_social})
        const validaEmail = await Store.findOne({email})
        const validaNomeFantasia = Store.findOne({nome_fantasia})

        if(validaRazaoSocial){
            return res.status(422).send({
                mensagem: "Esta razão social já foi cadastrada!"
            })
        }else if(validaEmail){
            return res.status(422).send({
                mensagem: "Este email já foi cadastrado!"
            })
        }else if(validaNomeFantasia){
            return res.status(422).send({
                mensagem: "Este nome fantasia já foi cadastrado!"
            })
        }

        await axios.get(`viacep.com.br/ws/${cep}/json/`).then((response)=>{
            console.log(response)
        }).catch(error=>{
            console.log(error)

            return res.status(422).send({
                mensagem: "Erro ao validar o cep!"
            })
        })

        const cnpjHash = await bcrypt.hash(cnpj, 10)

        const newStore = new Store({
            razao_social,
            cnpj: cnpjHash,
            nome_fantasia,
            email,
            telefone,
            celular,
            cep,
            logradouro,
            numero,
            bairro,
            cidade,
            estatdo,
            complemento
        })

        await newStore.save()

        return res.status(201).send({
            mensagem: "Loja cadastrada com sucesso!",
            detalhes_da_loja: newStore
        })
    }catch(error){
        if(error instanceof yup.ValidationError){
            const errors = [captureErrorYup(error)]

            return res.status(422).send({
                mensagem: "Erro ao cadastrar a loja!",
                erros: errors
            })
        }
    }
}

exports.findAllStores = async (req, res)=>{
    try{
        const allStores = await Store.find()

        return res.status(200).send({
            sucesso: allStores
        })
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao retornar todas as lojas!"
        })
    }
}