const express = require("express");
const { loginController, signupController } = require("../controllers");
const router = express.Router();

// Calling controllers with required http methods
router.post('/signup', signupController) 
router.post('/login', loginController)

module.exports = router;