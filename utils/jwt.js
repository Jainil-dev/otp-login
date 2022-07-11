const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      number: user.number,
    },
    process.env.JWT_SECRET,
    { expiresIn: "48h" }
  );
};
