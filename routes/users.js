var express = require("express");
var router = express.Router();
const { signUp, verifyOtp } = require("../controllers/userController");

/* GET users listing. */
router.post("/signUp", signUp);
router.post("/signUp/verify", verifyOtp);

module.exports = router;
