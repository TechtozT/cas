const express = require("express");
const { Notification } = require("../db/model");
const { authA, authU } = require("../auth/auth");

const router = express.Router();

router.get("/admin/*", authA);

router.get("/user/*", authU);

router.get("/:user/:type", async (req, res) => {
  try {
    let nots;
    const type = req.params.type;
    if (type === "all") {
      nots = await Notification.find({ subscriber: req.id });
    } else {
      nots = await Notification.find({ subscriber: req.id, type: type });
    }

    if (!nots) throw new Error("No nots");
    return res.json(nots);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
