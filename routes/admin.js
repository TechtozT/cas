const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const {
  SchoolResult,
  CollegeResult,
  Admin,
  Criteria,
  Program,
  Institution,
  Attribute,
  Application,
} = require("../db/model");

const { authA, decodeToken } = require("../auth/auth");
const TCU_DEFAULT_ID = require("../env").TCU_DEFAULT_ID;

router.get("/criteria", authA, async (req, res) => {
  try {
    let criteria;
    const token = req.decodedToken;
    if (token.role === "super") {
      // Can get all criteria
      criteria = await Criteria.find();
      return res.json(criteria);
    }

    const user = await Admin.findOne({ _id: token.id }, { institution: 1 });
    if (!user) throw new Error("User not found");
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
    req.body.institution = user.institution;
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

/**
 * Programs routes
 */
router.get("/programs", authA, async (req, res) => {
  try {
    let programs;
    const token = req.decodedToken;
    if (token.role === "super") {
      // Can get all criteria
      programs = await Program.find();
      return res.json(programs);
    }

    const user = await Admin.findOne({ _id: token.id }, { institution: 1 });

    programs = await Institution.findOne(
      { _id: user.institution },
      { programs: 1 }
    );
    if (!programs) throw new Error("Error fetching criteria");
    return res.json(programs.programs);
  } catch (err) {
    console.log(err);
  }
});

router.post("/program", authA, async (req, res) => {
  try {
    if (req.role !== "admin" && req.role !== "super") {
      return res.status(401).json({ auth: false });
    }
    let programs;
    if (req.role === "super") {
      programs = new Program(req.body);
      programs = await programs.save();
      return res.json(programs);
    }

    const user = await Admin.findOne({ _id: req.id }, { institution: 1 });
    if (!user) throw new Error("User not found");
    programs = await Institution.updateOne(
      { _id: user.institution },
      { $push: { programs: req.body } }
    );
    if (!programs) throw new Error("Error creating criteria");

    programs = await Institution.findOne(
      { _id: user.institution },
      { programs: 1 }
    );
    return res.json(programs.programs);
  } catch (err) {
    console.log(err);
  }
});

router.get("/institution", authA, async (req, res) => {
  let institutions;
  try {
    if (req.role === "super") {
      institutions = await Institution.find({});
      return res.json(institutions);
    }

    const user = await Admin.findOne({ _id: req.id }, { institution: 1 });
    if (!user) throw new Error("User not found");
    institutions = await Institution.find({ _id: user.institution });
    return res.json(institutions);
  } catch (err) {
    console.log(err);
  }
});

router.post("/institution", authA, async (req, res) => {
  //? Institution can only be posted by super
  if (req.role !== "super") {
    return res.status(403).json({ auth: false, msg: "Not authorized" });
  }
  let institutions;
  try {
    if (!req.body.length) {
      institutions = new Institution(req.body);
      institutions = await institutions.save();
    } else {
      institutions = await Institution.insertMany(req.body);
    }

    return res.json(institutions);
  } catch (err) {
    console.log(err);
  }
});

router.get("/users", authA, async (req, res) => {
  try {
    if (req.role === "admin") {
      const user = Admin.findById(req.id, { institution: 1 });
      const users = await Admin.find({ institution: user.institution });
      return res.status(200).json(users);
    }

    if (req.role === "super") {
      const users = await Admin.find(
        { institution: TCU_DEFAULT_ID },
        { firstName: 1, lastName: 1, email: 1, phoneNumber: 1 }
      );
      return res.status(200).json(users);
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/user", authA, async (req, res) => {
  //? If user is added by super then it has already have institution
  //? otherwise user institution is admin institution.

  let user;
  try {
    if (req.role == "admin") {
      const user = await Admin.findById(req.id, { institution: 1 });
      req.body.institution = user.institution;
      req.body.role = "admin";
    }

    if (req.role === "super") {
      if (req.body.institution === "super") {
        //? replace institution to default tcu _id
        req.body.institution = TCU_DEFAULT_ID;
        req.body.role = "super";
      } else {
        req.body.role = "admin";
      }
    }

    //? Hash password
    req.body.password = bcrypt.hashSync(req.body.password, 11);

    if (req.role === "super") {
      user = new Admin(req.body);
      user = await user.save();

      return res.json(user);
    }

    const admin = await Admin.findOne({ _id: req.id }, { institution: 1 });
    req.body.institution = admin.institution;
    user = new Admin(req.body);
    user = await user.save();

    return res.json(user);
  } catch (err) {
    console.log(err);
  }
});

router.post("/school_results", authA, async (req, res) => {
  //? only super
  if (req.role !== "super") {
    return res.status(403).json({ msg: "Not authorized" });
  }

  try {
    const results = await SchoolResult.insertMany(req.body);
    if (!results) throw new Error("Failed to upload results");
    return res.json(results);
  } catch (err) {
    console.log(err);
  }
});

router.get("/applications", authA, async (req, res) => {
  let applications;
  try {
    if (req.role === "super") {
      applications = await Application.find({});
      if (!applications) throw new Error("Failed to fetch applications");

      return res.json(applications);
    }

    const user = await Admin.findById(req.id, { institution: 1 });
    if (!user) throw new Error("Error fetching user");

    applications = await Application.find({
      "entry.institution.inst": user.institution,
    });

    if (!applications) throw new Error("Error fetching applications");

    return res.json(applications);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
