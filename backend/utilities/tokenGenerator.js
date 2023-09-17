const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.jwt_key, {
        expiresIn: "30d"
    })
}

module.exports = generateToken;