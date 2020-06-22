const express = require("express");
const router = express.Router();

const mod = require("../db/model");
const auth = require("../auth/auth");

const models = {
  applicant: mod.Applicant,
  application: mod.Application,
  attribute: mod.Attribute,
  criteria: mod.Criteria,
  institution: mod.Institution,
  program: mod.Program,
};

const { create, get, remove, update } = require("../resolvers/index");

const checkAuth = (req, res, next) => {
  /* Check route first */
  const entity = req.params.entity;
  if (!models[entity]) return res.sendStatus(404);
  /* Check if authorized to this route */
  // if (!auth.isAuth(req.headers.authorization)) return res.status(403).json({ auth: false });
  next();
};

router.post("/:entity", checkAuth, async (req, res) => {
  return res.json(create(models[entity], req.body));
});

router.get("/:entity", checkAuth, async (req, res) => {
  const result = await get(
    models[req.params.entity],
    req.query.options,
    req.query.projection,
    req.query.population
  );
  return res.json(result);
});

router.put("/:entity", checkAuth, async (req, res) => {
  return res.json(update(models[entity], req.body.ids, req.body.update));
});

router.delete("/:entity", checkAuth, async (req, res) => {
  return res.json(remove(models[entity], req.body));
});

// registration, login with jwt.
router.post("/auth/:entry", (req, res) => {
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
});

module.exports = router;
