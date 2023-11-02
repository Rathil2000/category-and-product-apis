const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const adminController = require('../../controllers/admin.controller');
const authValidation = require('../../validation/auth.validation');
const auth = require("../../middlewares/auth")
const adminValidation = require("../../validation/admin.validation")
router.post('/login', validate(authValidation.adminLogin), adminController.login);
router.post('/forgot-password', validate(authValidation.adminForgotPassword), adminController.forgotPassword);
router.post('/reset-password', validate(adminValidation.resetPassword), adminController.adminResetPassword);
router.post('/list-events/:eventProducerId?', auth(), validate(adminValidation.getEvents), adminController.getEvents);
router.post("/logout", auth(), adminController.logout)
router.get('/users', auth(), adminController.getUsers); 
module.exports = router;
