const crypto = require("crypto")

const hashing = (salt, password) => {

    const hash = crypto.createHash('sha256');
    hash.update(salt + password)
    const hashedPassword = hash.digest('hex')

    return hashedPassword;
}

const emailRegex = /^[^\d][a-zA-Z\d._-]*[a-zA-Z][a-zA-Z\d._-]*@([a-zA-Z\d.-]+\.[a-zA-Z]{2,})$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@])[a-zA-Z\d@]+$/;
const nameRegex = /^[a-zA-Z]+$/;

module.exports = { hashing, emailRegex, passwordRegex, nameRegex };