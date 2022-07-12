const db = require("../models/index");
const { generateToken } = require("../utils/jwt");

module.exports.signUp = async (req, res, next) => {
  try {
    const number = req.body.number;

    const otpHolder = await db.otpModel.find({ number: number });

    // OTP already sent
    if (otpHolder.length > 0) {
      // Time greater less than 3 mins
      if (Date.now() - otpHolder[0].createdAt <= 180000) {
        return res
          .status(400)
          .json({ status: "error", message: "Otp already send" });
      }
      await db.otpModel.deleteMany({ number: req.body.number });
    }

    // Generate OTP
    let OTP = Math.random();
    OTP = OTP * 1000000;
    OTP = parseInt(OTP);
    console.log(OTP);

    //save otp in db
    const savedOtp = await db.otpModel.create({ number, otp: OTP });

    return res.status(200).json({
      status: "success",
      message: "Otp sent",
      data: { id: savedOtp._id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

module.exports.verifyOtp = async (req, res, next) => {
  try {
    const otpHolder = await db.otpModel.findOneAndUpdate(
      {
        _id: req.body.id,
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
      await db.otpModel.deleteMany({ _id: req.body.id });
      return res.status(400).send({
        status: "error",
        message: "Maximum attemps limit Reached , Generate new otp",
      });
    }

    // OTP wrong
    if (req.body.otp !== otpHolder.otp) {
      return res
        .status(400)
        .json({ status: "error", message: "OTP is wrong!" });
    }

    const user = await db.userModel.create({ number: otpHolder.number });
    const token = generateToken(user);

    // Delete otp
    await db.otpModel.deleteMany({
      _id: req.body.id,
    });

    return res.status(200).json({
      status: "success",
      message: "User Registration Successfull!",
      data: {
        token: token,
        user: user,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
