const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const db = require("../models/index");

module.exports.signUp = async (req, res, next) => {
  const user = await db.userModel.findOne({ number: req.body.number });
  if (user) {
    return res
      .status(400)
      .json({ status: "error", message: "User already Registered" });
  }
  const OTP = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  const number = req.body.number;
  console.log(OTP);

  const otp = new OTP({ number, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  return res.status(200).json({ status: "success", message: "otp sent" });
};

module.exports.verifyOtp = async (req, res, next) => {};
