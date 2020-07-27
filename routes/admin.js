const express = require("express");

const router = express.Router();

const {
  SchoolResult,
  CollegeResult,
  Admin,
  Criteria,
  Program,
  Institution,
  Attribute,
} = require("../db/model");

const { authA, decodeToken } = require("../auth/auth");
const TCU_DEFAULT_ID = require("../env").TCU_DEFAULT_ID;

// Check authentication for all admin routes
router.get("/*", authA);
// router.post("/*", authA);

router.get("/criteria", async (req, res) => {
  try {
    let criteria;
    const token = req.decodeToken;
    if (token.role === "super") {
      // Can get all criteria
      criteria = await Criteria.find();
      return res.json(criteria);
    }

    const user = await Admin.findOne({ _id: token.id }, { institution: 1 });
    criteria = await Criteria.find({ institution: user.institution });

    if (!criteria) throw new Error("Error fetching criteria");
    return res.json(criteria);
  } catch (err) {
    console.log(err);
  }
});

/**
 * If criteria was posted by TCU i.e super then institution = _tcu.
*/
router.post("/criteria", authA, async (req, res) => {
  console.log(req.body)
  try {
    if (req.role !== "admin" && req.role !== "super") {
      return res.status(401).json({ auth: false });
    }
    let criteria;
    if (req.role === "super") {
      req.body.institution = TCU_DEFAULT_ID;
      criteria = new Criteria(req.body);
      criteria = await criteria.save();
      return res.json(criteria);
    }

    const user = await Admin.findOne({ _id: req.id }, { institution: 1 });
    if (!user) throw new Error("User not found");
    criteria = new Criteria(req.body);
    criteria = await criteria.save();
    if (!criteria) throw new Error("Error creating criteria");
    return res.json(criteria);
  } catch (err) {
    console.log(err);
  }
});

router.put("/criteria", async (req, res) => {
  // this is important when admin want to change the criteria in the next round
  try {
    const token = decodeToken(req.headers.authentication);
    if (!token || token.role !== "admin" || token.role !== "super") {
      return res.status(401).json({ auth: false });
    }

    const id = req.body._id;
    delete req.body._id;

    let criteria;
    if (token.role === "super") {
      criteria = Criteria.updateOne({ _id: id }, req.body);
      return res.json(criteria);
    }

    const user = Admin.findById(token.id, { institution: 1 });
    criteria = await Criteria.updateOne({
      _id: id,
      institution: user.institution,
    });
    if (!criteria) throw new Error("Failed to update criteria");

    return res.json(criteria);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/criteria", async (req, res) => {
  const token = decodeToken(req.headers.authentication);
  if (!token || token.role !== "admin" || token.role !== "super") {
    return res.status(401).json({ auth: false });
  }

  let result;
  if (token.role === "super") {
    result = await Criteria.deleteOne({ _id: req.body._id });
    return res.json(result);
  }

  const user = Admin.findById(token.id, { institution: 1 });
  result = await Criteria.deleteOne({
    _id: req.body._id,
    institution: user.institution,
  });
  return res.json(result);
});

module.exports = router;
