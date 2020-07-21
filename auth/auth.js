const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Applicant, SchoolResult, CollegeResult } = require("../db/model");
const { config, urls } = require("../env");
// const { unpackDoc } = require("../helpers/helper");

const jwtOptions = {
  expiresIn: 86400,
  issuer: urls.BASE_URL,
};

module.exports = {
  /**
   * @param entryLevel : The level that the user intends to apply ["school", "college"].
   * @param user : The user credential
   */

  register: async (user, entryLevel) => {
    try {
      const result = await Applicant.findOne({ indexNo: user.indexNo });
      if (result) throw new Error("User already exist");

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

      const newUser = new Applicant(user);
      newUser = await newUser.save();
      if (!newUser) throw new Error("Failed to create user");
      const userToken = jwt.sign(
        { id: newUser._id, indexNo: newUser.indexNo },
        config.SECRET,
        jwtOptions
      );

      return {
        user: newUser,
        userToken: userToken,
      };
    } catch (err) {
      console.log(err);
    }
  },

  login: async (cred) => {
    try {
      // if (token.userToken) throw new Error("User already logged in");
      const applicant = await Applicant.findOne(
        { indexNo: cred.indexNo },
        { indexNo: 1, password: 1 }
      );

      if (!applicant)
        return {
          user: null,
          userToken: null,
        };

      if (!bcrypt.compareSync(cred.password, applicant.password))
        throw new Error("Password mismatch");
      return {
        userToken: jwt.sign(
          { id: applicant._id, indexNo: applicant.indexNo },
          config.SECRET,
          jwtOptions
        ),

        user: applicant,
      };
    } catch (err) {
      throw err;
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
};
