const JWT = require("jsonwebtoken");

const secret = "lolbaklol";

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        salt: user.salt,
    };
    const token = JWT.sign(payload, secret);
    return token;
}

module.exports = {
    createTokenForUser,
};