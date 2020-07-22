const express = require("express");
const router = express.Router();

const {authA} = require("../auth/auth");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "CAS" });
});

/* GET user page */
router.get("/user", (req, res) => {
  
  res.render("user", { name: "User Page" });
});

/* GET admin page */
router.get("/admin", authA, (req, res) => {
  res.render("admin", { name: "CAS Admin",  role: req.role, email: req.email});
});

module.exports = router;
