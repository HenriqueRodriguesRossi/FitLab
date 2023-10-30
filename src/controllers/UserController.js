const User = require("../models/User")
const yup = require("yup")
const captureErrorYup = require("../utils/captureErrorYup")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.newUser = async (req, res)=>{
    try{
        const {full_name, cpf, email, password, repeate_password} = req.body

        const UserSchema = yup.object().shape({
            full_name: yup.string().required("O nome completo é obrigatório!"),
            cpf: yup.string().required("O cpf é obrigatório!").min(11, "O cpf deve ter 11 números!").max(11, "O cpf deve ter 11 números!"),
            email: yup.string().required("O email é obrigatório!").email("Por favor, digite um email válido!"),
            password: yup.string().required("A senha é obrigatório!").min(6, "A senha deve ter no mínimo 6 caracteres!").max(30, "A senha deve ter no máximo 3 caracteres!"),
            repeate_password: yup.string().oneOf([password, null], "As senhas devem ser iguais!")
        })
    
        await UserSchema.validate(req.body, {abortEarly: false})

        const cpfValidate = await User.findOne({
            cpf
        })

        const emailValidate = await User.findOne({
            email
        })

        if(cpfValidate){
            return res.status(422).send({
                mensagem: "Este cpf já foi cadastrado!"
            })
        }else if(emailValidate){
            return res.status(422).send({
                mensagem: "Este email já foi cadastrado!"
            })
        }

        const cpfHash = await bcrypt.hash(cpf, 10)
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            full_name,
            cpf: cpfHash,
            email,
            password: passwordHash
        })

        await newUser.save()

        return res.status(201).send({
            mensagem: "Usuário criado com sucesso!",

            user_details: newUser
        })
    }catch(error){
        if(error instanceof yup.ValidationError){
            const errors = [captureErrorYup(error)]
            return res.status(422).send({
                mensagem: "Erro ao cirar conta!",
                errors: errors
            })
        }else{
            console.log(error)

            return res.status(500).send({
                mensagem: "Erro ao criar a conta!"
            })
        }
    }
    
}

exports.login = async (req, res)=>{
    try{
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).send({
                mensagem: "Por favor, preencha todos os campos!"
            })
        }

        const user = await User.findOne({email})
        const checkPass = await bcrypt.compare(password, user.password)

        if(!user || !checkPass){
            return res.status(404).send({
                mensagem: "Email ou senha estão incorretos!"
            })
        }

        const secret = process.env.SECRET

        const token = jwt.sign({
            _id: user.id
        }, secret)

        return res.status(200).send({
            mensagem: "Login efetuado com sucesso!",
            token: token,
            user_id: user.id
        })
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao efetuar o login!"
        })
    }
}

exports.findAllUsers = async (req, res)=>{
    try{
        const findAllUsers = await User.find()

        if(!findAllUsers || findAllUsers.length == 0){
            return res.status(404).send({
                mensagem: "Nenhum usuário encontrado!"
            })
        }else {
            return res.status(200).send({
                mensagem: "Busca efetuda com sucesso!",

                users:  [findAllUsers]
            })
        }
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao retornar os usuários!"
        })
    }
}

exports.findUserById = async (req, res)=>{
    try{
        const {user_id} = req.params

        if(!user_id){
            return res.status(400).send({
                mensagem: "Por favor, forneça id do usuário!"
            })
        }

        const findUserById = await User.findById({
            _id: user_id
        })

        if(!findUserById){
            return res.status(404).send({
                mensagem: "Nenhum usuário encontrado!"
            })
        }else {
            return res.status(200).send({
                mensagem: "Usuário encontrado!",

                user_details: [findUserById]
            })
        }
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao buscar o usuário!"
        })
    }
}