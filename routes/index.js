const express = require("express");
const { loginController, signupController, logoutController, policyDocsController, policyPDFController } = require("../controllers");
const router = express.Router();

// Calling controllers with required http methods
router.post('/signup', signupController) 
router.post('/login', loginController)
router.post('/logout', logoutController);
router.get('/getPolicyDocs', policyDocsController);
router.get('/getPolicyData', policyPDFController)

module.exports = router;