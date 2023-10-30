const Store = require("../models/Store");
const yup = require("yup");
const captureErrorYup = require("../utils/captureErrorYup");
const bcrypt = require("bcryptjs");
const axios = require("axios");

exports.newStore = async (req, res) => {
    try {
        const {
            razao_social,
            cnpj,
            nome_fantasia,
            email,
            senha,
            repita_senha,
            telefone,
            celular,
            cep,
            logradouro,
            numero,
            bairro,
            cidade,
            estado,
            complemento,
        } = req.body;

        const StoreSchema = yup.object().shape({
            razao_social: yup.string().required("A razão social é obrigatória!"),
            cnpj: yup.string().required("O CNPJ é obrigatório!").length(14, "O CNPJ deve ter 14 caracteres!"),
            nome_fantasia: yup.string().required("O nome fantasia é obrigatório!"),
            email: yup.string().required("O email é obrigatório!").email("Digite um email válido!"),
            senha: yup.string().required("A senha é obrigatória!").min(8, "A senha deve ter no mínimo 8 caracteres!").max(30, "A senha deve ter no máximo 30 caracteres!"),
            repita_senha: yup.string().oneOf([senha, null], "As senhas devem ser iguais!"),
            telefone: yup.string().min(8, "O telefone deve ter no mínimo 8 dígitos!").max(10, "O telefone deve ter no máximo 10 caracteres!"),
            celular: yup.string().required("O celular é obrigatório!").min(9, "O celular deve ter no mínimo 9 caracteres!").max(11, "O celular deve ter no máximo 11 dígitos!"),
            cep: yup.string().required("O CEP é obrigatório!").length(8, "O CEP deve ter exatamente 8 caracteres!"),
            logradouro: yup.string().required("O logradouro é obrigatório!"),
            numero: yup.number().required("O número é obrigatório!"),
            bairro: yup.string().required("O bairro é obrigatório!"),
            cidade: yup.string().required("A cidade é obrigatória!"),
            estado: yup.string().required("O estado é obrigatório!"),
            complemento: yup.string(),
        })

        await StoreSchema.validate(req.body,
            {
                abortEarly: false
            });

        const existsRazaoSocial = await Store.findOne({ razao_social });
        const existsEmail = await Store.findOne({ email });
        const existsNomeFantasia = await Store.findOne({ nome_fantasia });

        if (existsRazaoSocial) {
            return res.status(422).send({ mensagem: "Esta razão social já foi cadastrada!" });
        } else if (existsEmail) {
            return res.status(422).send({ mensagem: "Este email já foi cadastrado!" });
        } else if (existsNomeFantasia) {
            return res.status(422).send({ mensagem: "Este nome fantasia já foi cadastrado!" });
        }

        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const cepData = response.data;
        if (cepData.erro) {

            return res.status(422).send({
                mensagem: "CEP inválido!"
            });
        }

        const cnpjHash = await bcrypt.hash(cnpj, 10);
        const passwordHash = await bcrypt.hash(senha, 10)

        const newStore = new Store({
            razao_social,
            cnpj: cnpjHash,
            nome_fantasia,
            email,
            senha: passwordHash,
            telefone,
            celular,
            cep,
            logradouro,
            numero,
            bairro,
            cidade,
            estado,
            complemento
        });

        await newStore.save();

        return res.status(201).send({
            mensagem: "Loja cadastrada com sucesso!",
            detalhes_da_loja: newStore,
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = [captureErrorYup(error)];

            return res.status(422).send({
                mensagem: "Erro ao cadastrar a loja!",
                erros: errors,
            });
        } else {
            console.error(error);
            return res.status(500).send({
                mensagem: "Erro interno ao cadastrar a loja!",
            });
        }
    }
};

exports.findAllStores = async (req, res) => {
    try {
        const allStores = await Store.find();

        if (!allStores || allStores.length === 0) {
            return res.status(404).send({
                mensagem: "Nenhuma loja foi encontrada!",
            });
        } else {
            return res.status(200).send({
                sucesso: allStores,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            mensagem: "Erro ao retornar todas as lojas!",
        });
    }
};

exports.StoreLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).send({
                mensagem: "Email e senha são obrigatórios!"
            })
        }

        const verificaSeEmailExiste = await Store.findOne({ email })
        const verificaSenha = await bcrypt.compare(password, verificaSeEmailExiste.password)

        if (!verificaSeEmailExiste || !verificaSenha) {
            return res.status(422).send({
                mensagem: "Email ou senha estão incorretos!"
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao efetuar o login!"
        })
    }
}

exports.findeStoreById = async (req, res) => {
    try {
        const { store_id } = req.params

        if (!store_id) {
            return res.status(400).send({
                mensagem: "Por favor, forneça o id da loja na url da requisição!"
            })
        }

        const findStoreById = await Store({
            _id: store_id
        })

        if (!findStoreById) {
            return res.status(404).send({
                mensagem: "Nenhuma loja foi encontrada!"
            })
        } else {
            return res.status(200).send({
                mensagem: "Busca efetuada com sucesso!",

                store_details: findStoreById
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao buscar a loja!"
        })
    }
}

exports.findStoresByName = async (req, res) => {
    try {
        const { razao_social } = req.body

        if (!razao_social) {
            return res.status(400).send({
                mensagem: "Por favor, digite a razão social da loja!"
            })
        }

        const store = await Store.findOne({ razao_social })

        if (!store) {
            return res.status(404).send({
                mensagem: "Nenhuma empresa foi encontrada!"
            })
        } else {
            return res.status(200).send({
                mensagem: "Busca efetuada com sucesso!",

                store_details: store
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao pesquisar a loja!"
        })
    }
}

exports.alterStoreEmail = async (req, res) => {
    try {
        const { store_id } = req.params

        if (!store_id) {
            return res.status(400).send({
                mensagem: "Por favor, forneça o id da loja no url da requisição!"
            })
        }

        const { newEmail } = req.body
        const newEmailValidate = await Store.findOne({
            email: newEmail
        })

        if (!newEmail) {
            return res.status(400).send({
                mensagem: "Por favor, forneça o novo email!"
            })
        } else if (newEmailValidate) {
            return res.status(422).send({
                mensagem: "Esse email já está em uso!"
            })
        }

        const alterStoreEmail = await Store.findByIdAndUpdate({
            email: newEmail
        })

        if (!alterStoreEmail) {
            return res.status(404).send({
                mensagem: "Nenhuma loja foi encontrada!"
            })
        } else {
            return res.status(200).send({
                mensagem: "Busca efetuada com sucesso!",

                new_email: alterStoreEmail.email
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao alterar o email!"
        })
    }
}

exports.alterStorePassword = async (req, res) => {
    try {
        const { store_id } = req.params

        if (!store_id) {
            return res.status(400).send({
                mensagem: "Por favor, forneça o id da loja!"
            })
        }

        const { new_password, confirm_new_pass } = req.body

        const newPasswordSchema = yup.object().shape({
            new_password: yup.string().required("O campo nova senha é obrigatório!").min(8, "A nova senha deve ter no mínimo 8 caracteres!").max(30, "A senha deve ter no máximo 30 caracteres!"),

            confirm_new_pass: yup.string().required("A confirmação da senha é obrigatória!").oneOf([password, null], "As senhas devem ser iguais!")
        })

        await newPasswordSchema.validate(req.body, { abortEarly: false })

        const newPassHash = await bcrypt.hash(new_password, 10)

        const alterStorePass = await Store.findByIdAndUpdate({
            _id: store_id,
            senha: newPassHash
        })

        if (!alterStorePass) {
            return res.status(404).send({
                mensagem: "Nenhuma loja encontrada!"
            })
        } else {
            return res.status(200).send({
                mensagem: "Senha alterada com sucesso!"
            })
        }
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = [captureErrorYup(error)]

            return res.status(422).send({
                mensagem: "Erro ao alterar a senha!",

                erros: errors
            })
        } else {
            console.log(error)

            return res.status(500).send({
                mensagem: "Erro ao alterar a senha!"
            })
        }
    }
}

exports.deleteStoreAccount = async (req, res) => {
    try {
        const { store_id } = req.params

        if (!store_id) {
            return res.status(400).send({
                mensagem: "Por favor, forneça o id da loja na URL da requisição!"
            })
        }

        const deleteStoreAccount = await Store.findByIdAndDelete({
            _id: store_id
        })

        if(!deleteStoreAccount){
            return res.status(404).send({
                mensagem: "Nenhuma loja foi encontrada!"
            })
        }else {
            return res.status(200).send({
                mensagem: "Conta exluída com sucesso!"
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao excluir a conta!"
        })
    }
}