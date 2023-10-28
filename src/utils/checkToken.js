const jwt = require("jsonwebtoken");

function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            menssagem: "Nenhum token encontrado!"
        });
    }

    try {
        const secret = process.env.SECRET;

        const decoded = jwt.verify(token, secret);

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            menssagem: "Token inválido ou expirado!"
        });
    }
}

module.exports = checkToken;