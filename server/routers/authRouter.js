const express = require("express");
const validateForm = require("../controllers/validateForm");
const router = express.Router();
const { handlelogin, attemptLogin, attemptRegister }= require('../controllers/authControllers');

router
.route('/login')
.get(handlelogin)
.post(validateForm, attemptLogin);

router.post("/register", validateForm, attemptRegister);

module.exports = router;