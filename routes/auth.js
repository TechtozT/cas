const express = require("express");
const router = express.Router();
// const jwt = require("jsonwebtoken");

const { Admin, Applicant } = require("../db/model");
const { register, registerA, login, loginA } = require("../auth/auth");

router.post("/login", async (req, res) => {
  const info = req.body;
  let user;
  let token;
  try {
    user = await Admin.findOne(
      { email: info.email },
      { _id: 1, password: 1, email: 1, role: 1 }
    );
    if (!user) {
      user = await Applicant.findOne(
        { indexNo: info.email },
        { _id: 1, password: 1, email: 1, indexNo: 1 }
      );
    }

    if (!user) throw new Error("User not found");
    if (user.role === "super" || user.role === "admin") {
      token = loginA(user, info);
    } else {
      token = login(user, info);
    }

    return res.json({ auth: true, token: token, role: user.role });
  } catch (err) {
    return res.json(err);
  }
});

router.post("/register", async (req, res) => {
  try {
    const token = await register(req.body);
    if (!token) return res.json({ msg: "Failed to register" });
    return res.json({ token: token.userToken });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
