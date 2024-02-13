const { loginUser, checkForExistingUser, signupUser }  = require("../repositories")
const crypto = require("crypto");
const { hashing } = require("../util");

exports.loginService = async (loginData) => {
    const {email, password} = loginData
    const result = await loginUser(email); // login query
    if(result.length > 0)
    {
        const databasePass = result[0].password;
        const hashedPassword = hashing(result[0].salt, password)

        if(databasePass != hashedPassword)
        {
            throw new Error("Wrong Password");
        }
        else return result;
    }
    else return result;
};

exports.signupService = async(signupData) => {
    const result = await checkForExistingUser ( signupData );  // to check for existing user

    if(result.length > 0)
    {
        return result;
    } else {
        console.log(signupData);
        const salt = crypto.randomBytes(16).toString('hex');
        signupData.password = hashing(salt, signupData.password);
        signupData.salt = salt;

        const insert = await signupUser( signupData ); // To insert new user
        return insert;
    }
}