/* 
  There are two models of applications.
  1. Programs over Institutions.
    Choose program of your choice from the available ones.
    Specify the priority of the selected program.
    Chose institutions that are available that offer this program, specifying the
    priority of each institution.

    Example:
      [
        { program: program x1,
          choice: z1,
          institutions: [
            {choice: y1, inst: i1},
            {choice: y2, inst: i2},
            {choice: y3, inst: i3},
            ...
          ]
        },

        { program: program x2,
          choice: z2,
          institutions: [
            {choice: y1, inst: i1},
            {choice: y2, inst: i2},
            {choice: y3, inst: i3},
            ...
          ]
        },
      ]

  2. Institutions over Programs.
    Choose institution and then choose the programs by priority.

    Example:
      [
        {
          {institution: i1, choice: z1},
          programs: [
            {program: p1, choice: y1},
            {program: p2, choice: y2},
            {program: p3, choice: y3}
          ]
        },

        {
          {institution: i1, choice: z1},
          programs: [
            {program: p1, choice: y1},
            {program: p2, choice: y2},
            {program: p3, choice: y3}
          ]
        }
      ]
*/

const mod = require("../db/model");
const { get } = require("../resolvers/index");

const { unpackDoc, levelDict, gradeDict } = require("../helpers/helper");

/**
 * @param levels A reference levels of certain criteria. A criteria may have more than
 * one entry level such as Diploma and A-level.
 * @param stdLevel the examination's result level of the student.
 * @return true if qualified and false otherwise.
 */
const isQualifiedLevels = (levels, stdLevel) => {
  return levels.forEach((l) => {
    return levelDict.indexOf(l) > stdLevel;
  });
};

/**
 * @param mandatorySubs A reference mandatory subjects
 * @param stdSubs student result subjects
 * @return true if all subjects and there grades are match and false otherwise.
 */
const checkMandatorySubjects = (mandatorySubs, stdSubs) => {
  mandatorySubs.forEach((ms) => {
    let s = stdSubs.find((ss) => ss.name === ms.name);
    if (!s) return false;
    if (gradeDict.indexOf(ms.grade > ss.grade)) return false;
  });

  return true;
};

/**
 * @param stdResult Student's result.
 * @param programs Array of programs that we want to validate user criteria.
 * @return Array of programs indicating which one is valid and which one is not.
 */
const validateUserCriteria = async (stdResult, programs) => {
  let stdLevel = "";
  if (stdResult.level === "o" || stdResult === "a") {
    stdLevel = "school";
  } else {
    stdLevel = "college";
  }
  const criteriaIDs = [];

  if (!Array.isArray(programs)) programs = Array(programs);

  // fetch criteria
  programs.forEach((e) => {
    criteriaIDs.push(e.criteria);
  });

  // To avoid calling multiple times the same criteria.
  criteriaIDs = new Set(criteriaIDs);
  try {
    let criteria = await mod.Criteria.find({ id: { $in: criteriaIDs } });
    if (!criteria) throw new Error("Error fetching criteria for applications");
  } catch (err) {
    throw err;
  }
  criteria = unpackDoc(criteria);

  programs.forEach((e, i) => {
    // find the corresponding criteria from criteria set for this program
    const _criteria = criteria.find((c) => c.id === e.criteria)[stdLevel];

    if (!isQualifiedLevels(_criteria.level, stdLevel)) {
      return (programs[i].qualified = false);
    }

    if (_criteria.gradePoint > stdResult.gradePoint) {
      return (programs[i].qualified = false);
    }

    if (!_criteria.programs.includes(stdResult.program)) {
      return (programs[i].qualified = false);
    }

    if (!checkMandatorySubjects(_criteria.mandatorySubs, stdResult.subjects)) {
      return (programs[i].qualified = false);
    }

    return (programs[i].qualified = true);
  });
};

/**
 * It allocate applications to a an institutions.
 * @param level Application level in which the system trying to allocate at this year.
 * Example Diploma => To process diploma application, bachelor => ...
 */
const allocate = async (level) => {
  try {
    const thisYear = new Date(Date.now()).getFullYear();

    let attributes = await mod.Attribute.findOne();
    if (!attributes) throw new Error("Error fetching attributes");
    attributes = unpackDoc(attributes);

    // Loop for each choice
    for (let choice = 1; choice <= attributes.maxAppliedPrograms; choice++) {
      let applications = await mod.Application.aggregate([
        { $match: { year: thisYear, level: level, "entry.choice": choice } },
        { $unwind: "$entry" },

        {
          $group: {
            _id: {
              program: "$entry.program",
              point: "$entry.point",
            },
            doc: { $addToSet: { indexNo: "$indexNo", entry: "$entry" } },
          },
        },

        { $sort: { "doc.entry.point": 1 } },

        { $project: { "doc.indexNo": 1, "doc.applicant": 1, "doc.entry": 1 } },
      ]);

      if (!applications) throw new Error("Error fetching applications");

      if (applications.length === 0) continue;

      // get the university program detail and see if it still available.
      applications.forEach((app) => {
        app.doc.entry.institutions.forEach(async (inst) => {
          // Get program details for this institution
          let progDetails = await mod.institutions.find(
            {
              _id: inst,
              "programs.program": app._id.program,
            },
            { programs: 1 }
          );

          progDetails = unpackDoc(progDetails);

          if (progDetails.allocatedCandidates < progDetails.maxCandidates) {
            const allocated = await mod.Application.updateOne(
              { indexNo: app.doc.indexNo },
              {
                allocated: true,
                allocatedInst: inst,
                allocatedProg: app._id.program,
              }
            );

            if (!allocated) return;

            // increment allocated candidates
            progDetails.allocatedCandidates++;

            const updatedProgDetails = await mod.Institution.updateOne(
              {
                "programs.program": app._id.program,
              },
              {
                allocatedCandidates: progDetails.allocatedCandidates,
              }
            );

            if(!updatedProgDetails) return;
          }
        });
      });
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  isQualifiedLevels,
  checkMandatorySubjects,
  validateUserCriteria,
  allocate,
};
