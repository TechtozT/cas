const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Applicant, SchoolResult, CollegeResult } = require("../db/model");
const { config, urls } = require("../env");
// const { unpackDoc } = require("../helpers/helper");

const jwtOptions = {
  expiresIn: 86400,
  issuer: urls.BASE_URL,
};

const decodeToken = (token) => {
  return jwt.verify(token, config.SECRET, jwtOptions);
};

module.exports = {
  /**
   * @param entryLevel : The level that the user intends to apply ["school", "college"].
   * @param user : The user credential
   */

  decodeToken,

  register: async (user, entryLevel = "school") => {
    try {
      let result;
      const fUser = await Applicant.findOne({ indexNo: user.indexNo });
      if (fUser) throw new Error("User already exist");

      if (entryLevel === "school") {
        result = await SchoolResult.findOne({ indexNo: user.indexNo });
      } else if (entryLevel === "college") {
        result = await CollegeResult.findOne({ indexNo: user.indexNo });
      } else {
        return {
          user: null,
          userToken: null,
        };
      }

      if (!result) throw new Error("User not exist");

      user.password = bcrypt.hashSync(user.password, 11);

      let newUser = new Applicant(user);
      newUser = await newUser.save();
      if (!newUser) throw new Error("Failed to create user");

      const userToken = jwt.sign(
        { id: newUser._id, indexNo: newUser.indexNo },
        config.SECRET,
        jwtOptions
      );

      return {
        userToken: userToken,
      };
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * token should be sent by client when making request in authorization header.
   */

  isAuth: (userToken) => {
    return jwt.verify(userToken, config.SECRET, jwtOptions, (err, decToken) => {
      if (err) return null;
      return decToken;
    });
  },

  // returns token
  registerA: async (user) => {
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
  },

  // returns token
  loginA: (user, info) => {
    try {
      if (!bcrypt.compareSync(info.password, user.password)) {
        throw new Error("Password mismatch");
      }

      const adminToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        config.SECRET,
        jwtOptions
      );

      return adminToken;
    } catch (err) {
      console.log(err);
    }
  },

  login: (user, info) => {
    console.log("Info", info);
    console.log("user", user);
    try {
      if (!bcrypt.compareSync(info.password, user.password)) {
        throw new Error("Password mismatch");
      }

      const userToken = jwt.sign(
        { id: user._id, indexNo: user.indexNo },
        config.SECRET,
        jwtOptions
      );

      return userToken;
    } catch (err) {
      console.log(err);
    }
  },

  authU: (req, res, next) => {
    if (!req.headers["cookie"])
      return res.json({ auth: false, msg: "No token provided" });
    const token = req.headers["cookie"].split(" ")[1];
    if (token === "undefined") return res.redirect("/login");
    if (token.expiresIn > new Date(Date.now())) {
      return res.redirect("/login");
    }

    try {
      const decodedToken = decodeToken(token);
      if (!decodedToken.id)
        return res.json({ auth: false, message: "You are not authorized" });

      req.id = decodedToken.id;
      req.indexNo = decodedToken.indexNo;
      return next();
    } catch (err) {
      console.log(err);
      return res.end();
    }
  },

  authA: (req, res, next) => {
    if (!req.headers["cookie"])
      return res.json({ auth: false, msg: "No token provided" });
    const token = req.headers["cookie"].split(" ")[1];
    if (token === "undefined") return res.redirect("/login");
    try {
      const decodedToken = decodeToken(token);
      if (!decodedToken.id) return res.redirect("/login");
      if (decodedToken.role === "super" || decodedToken.role === "admin") {
        req.decodedToken = decodedToken;
        req.role = decodedToken.role;
        req.email = decodedToken.email;
        req.id = decodedToken.id;
        return next();
      }
      return res.json({ auth: false, message: "You are not authorized" });
    } catch (err) {
      console.log(err);
      return res.end();
    }
  },
};
