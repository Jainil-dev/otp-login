const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const db = require("../models/index");
const { generateToken } = require("../utils/jwt");
const _ = require("lodash");

module.exports.signUp = async (req, res, next) => {
  const user = await db.userModel.findOne({ number: req.body.number });
  if (user) {
    return res
      .status(400)
      .json({ status: "error", message: "User already Registered" });
  }
  const OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const number = req.body.number;
  console.log(OTP);

  const otp = new db.otpModel({ number, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const result = await otp.save();
  return res.status(200).json({ status: "success", message: "otp sent" });
};

module.exports.verifyOtp = async (req, res, next) => {
  const otpHolder = await db.otpModel.find({
    number: req.body.number,
  });
  if (otpHolder.length === 0)
    return res.status(400).send("You use an Expired OTP!");
  const rightOtpFind = otpHolder[otpHolder.length - 1];
  const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

  if (rightOtpFind.number === req.body.number && validUser) {
    const user = new db.userModel(_.pick(req.body, ["number"]));
    const token = generateToken(user);
    const result = await user.save();
    const OTPDelete = await db.otpModel.deleteMany({
      number: rightOtpFind.number,
    });
    return res.status(200).json({
      status: "success",
      message: "User Registration Successfull!",
      data: {
        token: token,
        data: result,
      },
    });
  } else {
    return res
      .status(400)
      .json({ status: "error", message: "Your OTP was wrong!" });
  }
};
