const jwt = require("jsonwebtoken");

function checkStoreToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const storeToken = authHeader && authHeader.split(" ")[1];

    if (!storeToken) {
        return res.status(401).json({
            menssagem: "Nenhum token encontrado!"
        });
    }

    try {
        const secret = process.env.STORE_SECRET;

        const decoded = jwt.verify(token, secret);

        req.store = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            menssagem: "Token inválido ou expirado!"
        });
    }
}

module.exports = checkStoreToken;