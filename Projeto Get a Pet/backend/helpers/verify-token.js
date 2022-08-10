const jwt = require("jsonwebtoken");
const getToken = require("./get-token");

const checkToken = (req, res, next) => {
  // Valida autorização da requisição
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Acesso Negado!" });
  }

  const token = getToken(req);
  // Valida se o token existe
  if (!token) {
    return res.status(401).json({ message: "Acesso Negado!" });
  }

  try {
    const verified = jwt.verify(token, "nossoSecret");
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Token Inválido!" });
  }
};

module.exports = checkToken;
