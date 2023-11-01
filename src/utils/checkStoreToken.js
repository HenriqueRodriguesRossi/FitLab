const jwt = require("jsonwebtoken");

function checkStoreToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const storeToken = authHeader && authHeader.split(" ")[1];

    if (!storeToken) {
        return res.status(401).json({
            mensagem: "Nenhum token encontrado!"
        });
    }

    try {
        const secret = process.env.STORE_SECRET;

        const decoded = jwt.verify(storeToken, secret); 

        req.store = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            mensagem: "Token inválido ou expirado!"
        });
    }
}

module.exports = checkStoreToken;
