// const bcrypt = require("bcrypt");
// const otpGenerator = require("otp-generator");
const db = require("../models/index");
// const { generateToken } = require("../utils/jwt");
// const _ = require("lodash");

module.exports.signUp = async (req, res, next) => {
  try {
    const number = req.body.number;

    const user = await db.otpModel.find({ number: number });
    console.log(user);
    if (user.length > 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Otp already send" });
    }

    let OTP = Math.random();
    OTP = OTP * 100000;
    OTP = parseInt(OTP);
    console.log(OTP);

    const otp = new db.otpModel({ number, otp: OTP });
    const result = await otp.save();

    return res.status(200).json({ status: "success", message: "otp sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

module.exports.verifyOtp = async (req, res, next) => {
  try {
    const otpHolder = await db.otpModel.findOneAndUpdate(
      {
        number: req.body.number,
      },
      { $inc: { attempts: -1 } }
    );
    // OTP not found
    if (!otpHolder)
      return res
        .status(400)
        .send({ status: "error", message: "Generate another otp" });

    // check Limit
    if (otpHolder.attempts <= 0) {
      await db.otpModel.deleteMany({ number: req.body.number });
      return res
        .status(400)
        .send({ status: "error", message: "Maximum attemps limit Reached" });
    }

    // OTP wrong
    if (
      otpHolder.number !== req.body.number ||
      req.body.otp !== otpHolder.otp
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Your OTP was wrong!" });
    }

    await db.otpModel.deleteMany({
      number: req.body.number,
    });

    return res.status(200).json({
      status: "success",
      message: "User Registration Successfull!",
      // data: {
      //   token: token,
      //   data: result,
      // },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
