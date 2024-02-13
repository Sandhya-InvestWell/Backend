const path = require("path");
const { loginService, signupService } = require("../services");
const { emailRegex, passwordRegex, nameRegex } = require("../util");
const jwt = require("jsonwebtoken")
const fsPromises = require("fs").promises
const folderName = "/home/sandhya/Downloads/Project1/frontend/public/PDF_Files"

exports.loginController = async (req, res) => {
    try {
        // Taking data from body
        const { email, password } = req.body;
        
        // Checking for email or password 
        if (!email || !password) {
            return res.send({
                status: 0,
                success: false,
                message: "Please enter email or password",
                result: {},
            });
        }

        else if (!emailRegex.test(email)) {
            return res.send({
                status: 0,
                sucess: false,
                message: "Email must contain atleast one letter, @ special character and it doesn't start with number.",
                result: {}
            })
        }

        else {
            const loginData = {email, password};
            const result = await loginService(loginData); // Calling login services

            if (result && result.length == 0) {
                throw new Error("Wrong Email")
            }

            // For successfull login
            else {
                const userData = {
                    name : result[0].name,
                    email : result[0].email
                }
                const token = await jwt.sign(userData, "abc@123", {expiresIn: "30s"});
                res.send({
                    status: 1,
                    success: true,
                    message: "Successfully Login",
                    result,
                    token
                }); 
            }
        }
    } catch (error) { // error handling
        console.log(error);
        if (error.message == "Wrong Email")
        {
            return res.send({
                status: 0,
                success: false,
                message: "User doesn't exist!! Please Register",
                result: {},
            });
        }
        else if(error.message == "Wrong Password")
        {
            return res.send({
                status: 0,
                success: false,
                message: "Wrong Password",
                result: {},
            });
        }
        return res.send({
            status: 0,
            success: false,
            message: "Error in Login controller",
            result: {},
        });
    }
};

exports.signupController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // checking whether data is received or not 
        if (!name || !email || !password) {
            return res.send({
                status: 0,
                sucess: false,
                message: "Please enter name, email or password",
                result: {}
            })
        }

        else if (!nameRegex.test(name)) {
            return res.send({
                status: 0,
                sucess: false,
                message: "Name must contain only letters.",
                result: {}
            })
        }

        else if (!emailRegex.test(email)) {
            return res.send({
                status: 0,
                sucess: false,
                message: "Email must contain atleast one letter, @ special character and it doesn't start with number.",
                result: {}
            })
        }

        else if (password.length < 6) {
            return res.send({
                status: 0,
                sucess: false,
                message: "Password length should be greater than 6.",
                result: {}
            })
        }

        else if (!passwordRegex.test(password)) {
            return res.send({
                status: 0,
                sucess: false,
                message: "Password must contain atleast one lowercase, one uppercase, one number and only @ special character is allowed",
                result: {}
            })
        }

        else {
            const signupData = { name, email, password };
            const result = await signupService(signupData); // calling signup services

            // If user already present in database then tell them to login
            if (result && result.length > 0) {
                return res.send({
                    status: 0,
                    success: false,
                    message: "User already exists! Please Login",
                    result: {},
                });
            }

            // For successful register
            else {
                return res.send({
                    status: 1,
                    sucess: true,
                    message: "Successfully registered",
                    result
                })
            }
        }
    } catch (error) {// error handling
        console.log(error);
        return res.send({
            status: 0,
            success: false,
            message: "Error in Signup controller",
            result: {}
        })
    }
}

exports.logoutController = async (req, res) => {
    try {
        const token = req.cookies.token; 
        const decodedToken = jwt.decode(token);
        console.log(decodedToken);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken && decodedToken.exp) 
        {
            if (decodedToken.exp > currentTime) {
                return res.send({
                    status: 1,
                    success: true,
                    message: "Got user Data",
                    decodedToken
                });
            }
        }
         else {
            return res.send({
                status: 0,
                success: false,
                message: "Token expired."
            });
        }
    } catch (error) {
        console.log(error);
        return res.send({
            status: 0,
            success: false,
            message: "Error in logout Controller",
        });
    }
};

exports.policyDocsController = async (req, res) => {
    try {
        const result = [];
        let index = 0;
        const policies = await fsPromises.readdir(folderName);
        
        policies.map(policy => {
            if(policy.includes(".pdf"))
            {
                index = index + 1;
                const policyData = {
                    index : index,
                    fileName : policy
                }
                result.push(policyData)
            }
        })

        return res.send({
            success : true,
            status : 1,
            message : "Successfully get PolicyDocs Data",
            result
        })
    } catch (error) {
        console.log(error);
        return res.send({
            success : false,
            status : 0,
            message : "Error in Policy Docs Controller"
        })
    }
}

exports.policyPDFController =  async(req, res) => {
    try {
        const fileName = req.query.fileName;
        console.log(fileName);
        let pdfPath;
        const policies = await fsPromises.readdir(folderName);
        policies.map(policy => {
            if(policy === fileName)
            {
                pdfPath = path.join(folderName, fileName);
                let index = pdfPath.indexOf("PDF");
                pdfPath = pdfPath.substring(index);
            }
        })
        console.log(pdfPath);

        return res.send({
            success : true,
            status : 1,
            message : "Get Pdf Path successfully",
            pdfPath,
        })
        
    } catch (error) {
        console.log(error);
        return res.send({
            success : false,
            status : 0,
            message : "Error in Policy Pdf Controller"
        })
    }
}