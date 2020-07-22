const express = require("express");
const router = express.Router();
// const jwt = require("jsonwebtoken");

const { Admin, Applicant } = require("../db/model");
const { register, registerA, login, loginA } = require("../auth/auth");

router.post("/login", async (req, res) => {
  console.log(req.headers["cookie"])
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
        { email: info.email },
        { _id: 1, password: 1, email: 1 }
      );
    }

    if (!user) throw new Error("User not found");

    if (user.role === "super" || user.role === "admin") {
      token = loginA(user, info);
    } else {
      token = login(info, user);
    }

    return res.json({ auth: true, token: token, role: user.role });
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

module.exports = router;
