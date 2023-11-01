const jwt = require("jsonwebtoken");

function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            mensagem: "Nenhum token encontrado!"
        });
    }

    try {
        const secret = process.env.SECRET;

        const decoded = jwt.verify(token, secret);

        req.store = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            mensagem: "Token inválido ou expirado!"
        });
    }
}

module.exports = checkToken;
