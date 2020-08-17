const express = require("express");
const router = express.Router();

const mod = require("../db/model");
const auth = require("../auth/auth");

const { validateInstitutions } = require("../cas/api");

const models = {
  applicant: mod.Applicant,
  application: mod.Application,
  attribute: mod.Attribute,
  criteria: mod.Criteria,
  institution: mod.Institution,
  program: mod.Program,
};

const {
  create,
  get,
  remove,
  update,
  initApplication,
} = require("../resolvers/index");


router.post("/:entity", auth.authU, async (req, res) => {
  const user = req.indexNo;
  const entity = req.params.entity;

  let result;

  if (entity === "application") {
    const data = {
      applicant: req.id,
      level: "b",
    };

    result = await initApplication(user, data);
    return res.status(200).json(result);
  }

  return res.json(create(models[entity], req.body));
});

router.get("/:entity", auth.authU, async (req, res) => {
  const entity = req.params.entity;
  const options = req.query.options;
  const projection = req.query.projection;
  const population = req.query.population;

  let result;
  // If entity is institutions and program is specified.
  if (entity === "institution") {
    const user = req.indexNo;
    const opt = JSON.parse(options);
    if (opt.hasOwnProperty("programs.program")) {
      result = await validateInstitutions(user, opt["programs.program"]);
    }
  } else {
    result = await get(models[entity], options, projection, population);
  }

  return res.json(result);
});

router.put("/:entity", auth.authU, async (req, res) => {
  const user = req.indexNo;
  let result;
  const entity = req.params.entity;
  if (entity === "application") {
    const match = { indexNo: user };
    const upd = { entry: [] };

    const stdResult = await mod.SchoolResult.findOne({ indexNo: user });
    if (stdResult === null) throw new Error("Error student not found");

    for (let i = 0; i < req.body.length; i++) {
      upd.entry.push({
        program: req.body[i].progID,
        progName: req.body[i].progName,
        choice: i,
        point: stdResult.gradePoint,
        institutions: req.body[i].institutions,
      });
    }
    result = await update(models[entity], match, upd);
    return res.json(result);
  }
});

router.delete("/:entity", auth.authU, async (req, res) => {
  return res.json(remove(models[entity], req.body));
});

// registration, login with jwt.
/* router.post("/auth/:entry", (req, res) => {
  const token = req.headers.authorization;
  if (auth.isAuth(token))
    return res.json({ auth: true, message: "Already logged in" });

  const entries = ["register", "login"];

  const entry = req.params.entry;
  if (entries.includes(entry) === false) return res.status(404);

  let result = {};

  if (entry === "register") {
    result = auth.register(req.body.user, req.body.entryLevel);
    if (!result.user)
      return res.json({
        auth: false,
        user: result.user,
        message: "User not found",
      });
    delete result.user.password;

    return res
      .status(200)
      .json({ auth: true, user: result.user, token: result.userToken });
  } else if (entry === "login") {
    result = auth.login(req.body.cred);
    if (!result.user)
      return res.json({
        auth: false,
        message: "User not found",
      });

    delete result.user.password;

    return res
      .status(200)
      .json({ auth: true, user: result.user, token: result.userToken });
  }
}); */

module.exports = router;
