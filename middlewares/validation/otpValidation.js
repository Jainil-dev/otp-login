const { check, validationResult } = require('express-validator');
const { generateErrorResponse } = require('../responseUtil');

exports.validateError = (req, res, next) => {
  const errors = validationResult(req).array();
  // console.log(typeof errors);
  if (!errors.length) return next();
  return res.json(
    generateErrorResponse(
      'Invalid Submission',
      errors.map((item) => item.msg),
    ),
  );
};

exports.validateUserSignUp = [
  check('number')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Number is Required')
    .isLength({ min: 10, max: 10 })
    .withMessage('Length of Phone Number should be 10')
    .isMobilePhone()
    .withMessage('Valid Number is Required'),
];

exports.validateVerifyOtp = [
  check('id')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Id is required')
    .isMongoId()
    .withMessage('Valid Id is required'),
  check('otp')
    .trim()
    .not()
    .isEmpty()
    .withMessage('otp is Required')
    .isLength({ min: 6, max: 6 })
    .withMessage('length of otp is 6'),
];
