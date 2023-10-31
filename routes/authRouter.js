const express = require('express');
// const authController = require('./../Controllers/authController')
const authController = require('./../controller/authController');
const { isAuthenticatedUser } = require('../middleware/authJwt');

const router = express.Router();

// router.route('/signup').post(authMiddleware,roleMiddleware(['user','admin']),authController.signup);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/me').get(isAuthenticatedUser,authController.getUserDetails)
router.route("/password/update").put(isAuthenticatedUser, authController.updatePassword);

module.exports = router;