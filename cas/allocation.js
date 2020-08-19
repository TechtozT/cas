/**
 * Process application by allocating student to the institution if appropriate
 * and discard otherwise.
 * 
 * ?? Get all application's entry whose choice is specified.
 * ?? Group by programs.
 * ?? Sort by entry point.
 */

const { Application, Attribute } = require("../db/model");

const allocate = async () => {
  try {
    const thisYear = new Date(Date.now()).getFullYear();
    let applications;
    let attributes = await Attribute.findOne();
    if (!attributes) throw new Error("Error fetching attributes");
    const maxAppliedPrograms = attributes.maxAppliedPrograms;
    // Loop for each choice
    for (let choice = 0; choice < maxAppliedPrograms; choice++) {
      applications = await Application.aggregate([
        { $match: { year: thisYear, "entry.choice": choice } },
        { $unwind: "$entry" },
        { $match: { "entry.choice": choice } },

        {
          $group: {
            _id: {
              program: "$entry.program",
            },
            doc: { $addToSet: { indexNo: "$indexNo", entry: "$entry" } },
          },
        },

        { $sort: { "doc.entry.point": 1 } },

        { $project: { "doc.indexNo": 1, "doc.entry": 1 } },
      ]);

      if (!applications) throw new Error("Error fetching applications");

      if (applications.length === 0) continue;
    }
  } catch (err) {
    console.log(err);
  }
};

allocate();
