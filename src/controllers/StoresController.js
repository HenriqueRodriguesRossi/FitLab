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