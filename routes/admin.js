const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  SchoolResult,
  CollegeResult,
  Admin,
  Criteria,
  Program,
  Institution,
  Attribute,
} = require("../db/model");
const { config, urls } = require("../env");

const jwtOptions = {
  expiresIn: 86400,
  issuer: urls.BASE_URL,
};

// returns token
const register = async (user) => {
  try {
    let result = await Admin.findOne({ email: user.email }, { _id: 1 });
    if (result) throw new Error("User already exist");
    admin.password = bcrypt.hashSync(admin.password, 11);
    const admin = new Admin(user);
    result = await admin.save();
    if (!result) throw new Error("Failed to create new user");

    const adminToken = jwt.sign(
      { id: result._id, email: result.email, role: result.role },
      config.SECRET,
      jwtOptions
    );

    return adminToken;
  } catch (err) {
    console.log(err);
  }
};

// returns token
const login = async (info) => {
  try {
    const user = await Admin.findOne({ _id: info.id });
    if (!user) throw new Error("User not found");

    if (!bcrypt.compareSync(info.password, user.password)) {
      throw new Error("Password mismatch");
    }

    const adminToken = jwt.sign(
      { id: result._id, email: result.email, role: result.role },
      config.SECRET,
      jwtOptions
    );

    return adminToken;
  } catch (err) {
    console.log(err);
  }
};

const decodeToken = (token) => {
  return jwt.verify(token, config.SECRET, jwtOptions);
};

const router = express.Router();

router.get("/criteria", async (req, res) => {
  try {
    const token = decodeToken(req.headers.authentication);
    if (!token) return res.status(401).json({ auth: false });
    const user = await Admin.findOne({ _id: token.id }, { institution: 1 });
    const criteria = await Criteria.find({ institution: user.institution });

    if (!criteria) throw new Error("Error fetching criteria");
    return res.json(criteria);
  } catch (err) {
    console.log(err);
  }
});

router.post("/criteria", async (req, res) => {
  try {
    const token = decodeToken(req.headers.authentication);
    if (!token || token.role !== "admin" || token.role !== "super") {
      return res.status(401).json({ auth: false });
    }
    let criteria = new Criteria(req.body);
    if (token.role === "super") {
      criteria = await criteria.save();
      return res.json(criteria);
    }

    const user = await Admin.findOne({ _id: token.id }, { institution: 1 });
    if (!user) throw new Error("User not found");

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

module.exports = router;