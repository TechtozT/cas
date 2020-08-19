const express = require("express");
const router = express.Router();

const { authU, authA } = require("../auth/auth");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "CAS" });
});

/* GET Login page */
router.get("/login", (req, res) => {
  res.render("login");
});

/* GET user page */
router.get("/user", authU, (req, res) => {
  res.render("user", { name: "CAS", index: req.indexNo });
});

/* GET admin page */
router.get("/admin", authA, (req, res) => {
  res.render("admin", { name: "CAS Admin", role: req.role, email: req.email });
});

module.exports = router;
