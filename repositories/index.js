const connectDb = require("./connectDb");
const util = require("util");

connectDb.connect();

const query = util.promisify(connectDb.query).bind(connectDb);

const loginUser = async(email) => {
    const result = await query(`SELECT * FROM users WHERE email = ?`, [email]);
    console.log(result);

    return result;
}

const checkForExistingUser = async (signupData) => {
    const { email } = signupData;
    const result = await query(`SELECT * FROM users WHERE email = ?`, [email]);

    console.log(result);
    return result;
}

const signupUser = async (signupData) => {
    const { name, email, password, salt } = signupData;
    const result = await query(`INSERT INTO users ( name, email, password, salt ) VALUES ( ?, ?, ?, ? )`, [name, email, password, salt]);

    console.log(result);
    return result;

}

module.exports = { loginUser, checkForExistingUser, signupUser };