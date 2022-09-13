const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    let validToken = req.headers["x-auth-token"];

    if (!validToken) {
      return res.status(400).send({ status: false, msg: "Missing token in request" });
    }

    let decodedToken = jwt.verify(validToken, "secret key");

    if (!decodedToken) {
      res.status(400).send({ status: false, msg: "Invalid token in request" });
    }

    req.decodedToken = decodedToken

    next();

  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

module.exports.authentication = authentication;
