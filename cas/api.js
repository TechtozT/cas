const mod = require("../db/model");
const {
  compareResultOverProgram,
} = require("./index");
// const { unpackDoc } = require("../helpers/helper");

/**
 * We assumes that user can apply this program level
 * @param indexNo The user index number.
 * @param program The specified program in which user specify.
 *
 */
const validateInstitutions = async (indexNo, program) => {
  const results = [];
  try {
    const stdResult = await mod.SchoolResult.findOne({ indexNo: indexNo });
    // stdResult = unpackDoc(stdResult);
    if (!stdResult) throw new Error("Error fetching user school results");

    // fetch institution that have this program and return only one program
    const institutions = await mod.Institution.find(
      {
        "programs.program": program,
      },
      { "programs.program.$": 1, name: 1 }
    );
    if (!institutions) throw new Error("Error fetching institutions");

    for (let i = 0; i < institutions.length; i++) {
      const criteria = await mod.Criteria.findOne({
        _id: institutions[i].programs[0].criteria,
      });

      if (!criteria) throw new Error("Error fetching criteria");

      if (compareResultOverProgram(stdResult, criteria)) {
        // console.log("OK: ", institutions[i]._doc.program)
        results.push({
          _id: institutions[i].id,
          name: institutions[i]._doc.name,
          qualified: true,
        });
      } else {
        // console.log("NOT OK: ", institutions[i]._doc.programs[0])
        results.push({
          _id: institutions[i].id,
          name: institutions[i]._doc.name,
          qualified: false,
        });
      }
    }

    return results;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  validateInstitutions,
};
