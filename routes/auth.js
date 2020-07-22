const express = require("express");
const router = express.router();

const { Admin, Applicant } = require("../db/model");
const { register, registerA, login, loginA } = require("../auth/auth");

router.post("/login", async (req, res) => {
  const info = req.body;
  const role = info.role;
  let user;
  try {
    if (!role) {
      user = await Applicant.findOne({ email: info.email });
    }

    if (role === "super" || role === "admin") {
      user = await Admin.findOne({ email: info.email });
    }

    if (!user) throw new Error("User not found");

    const token = loginA(user, info);
    req.headers.authorization = token;

    if (role === "admin" || role == "super") {
      return res.redirect("/admin");
    } else {
      res.redirect("/user");
    }
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});
