const express = require('express');

const router = express.Router();
const { signUp, verifyOtp } = require('../controllers/otpController');
const {
  validateUserSignUp,
  validateError,
  validateVerifyOtp,
} = require('../middlewares/validation/otpValidation');

/* GET users listing. */
router.post('/signUp', validateUserSignUp, validateError, signUp);
router.post('/signUp/verify', validateVerifyOtp, validateError, verifyOtp);

module.exports = router;
