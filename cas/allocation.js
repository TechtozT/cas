/**
 * Process application by allocating student to the institution if appropriate
 * and discard otherwise.
 *
 * ?? Get all application's entry whose choice is specified.
 * ?? Group by programs.
 * ?? Sort by entry point.
 */

const {
  Application,
  Attribute,
  Institution,
  Notification,
  Applicant,
} = require("../db/model");

const allocate = async () => {
  try {
    const thisYear = new Date(Date.now()).getFullYear();
    let applications;
    let attributes = await Attribute.findOne();
    if (!attributes) throw new Error("Error fetching attributes");
    const maxAppliedPrograms = attributes.maxAppliedPrograms;

    // To track allocated applications. This avoid database call every time for each
    // institution in application. Note this data has to be kept in memory.
    // for 100000 applications this will take 15 * 2 * 100000 bytes ~ 3MB.
    let allocatedIDs = [];

    // Loop for each choice
    for (let choice = 0; choice < maxAppliedPrograms; choice++) {
      applications = await Application.aggregate([
        {
          $match: { year: thisYear, "entry.choice": choice, allocated: false },
        },
        { $unwind: "$entry" },
        { $match: { "entry.choice": choice } },

        {
          $group: {
            _id: {
              program: "$entry.program",
            },
            doc: {
              $addToSet: {
                indexNo: "$indexNo",
                entry: "$entry",
              },
            },
          },
        },

        { $sort: { "doc.entry.point": 1 } },

        { $project: { "doc.indexNo": 1, "doc.entry": 1 } },
      ]);

      if (!applications) throw new Error("Error fetching applications");

      // Process next choice applications
      if (applications.length === 0) continue;

      // Process each application's group from this choices
      for (let i = 0; i < applications.length; i++) {
        let program = applications[i]._id.program;

        for (let j = 0; j < applications[i].doc.length; j++) {
          let doc = applications[i].doc[j];
          /* console.log(doc)
          break */

          // console.log(`Choice ${choice}: Group ${i} : Dock ${j}`,doc)
          for (let k = 0; k < doc.entry.institutions.length; k++) {
            // Check if user is already allocated
            if (allocatedIDs.includes(doc.indexNo.toLowerCase().trim())) {
              // console.log("Already allocated skipping", doc.indexNo);
              continue;
            }

            programDetails = await Institution.findOne(
              { "programs.program": program },
              { "programs.program.$": 1 }
            );

            // Available vacant places
            let slot =
              programDetails.programs[0].maxCandidates -
              programDetails.programs[0].allocatedCandidates;

            if (slot === 0) {
              console.log(
                `institution ${doc.entry.institutions} program ${program} is full`
              );
              continue;
            }

            // Allocate to this institution.
            let allocated = await Application.updateOne(
              { indexNo: doc.indexNo },
              {
                allocated: true,
                allocatedInst: doc.entry.institutions[k],
                allocatedProg: doc.entry.program,
              }
            );

            if (!allocated) {
              console.log("Failed to allocate", allocated);
              continue;
            }
            // Mark application as allocated
            allocatedIDs.push(doc.indexNo.toLowerCase().trim());
            // console.log(allocated);

            programDetails.programs[0].allocatedCandidates++;

            let updatedProgDetails = await Institution.updateOne(
              {
                "programs.program": program,
              },
              {
                "programs.$.allocatedCandidates":
                  programDetails.programs[0].allocatedCandidates,
              }
            );

            if (!updatedProgDetails || updatedProgDetails.nModified === 0) {
              console.log(
                "Failed to update program details",
                program,
                doc.entry.institutions[k].name
              );
            }

            // Create notification
            let subscriber = await Applicant.findOne(
              { indexNo: doc.indexNo },
              { _id: 1 }
            );

            if (!subscriber) {
              console.log("Failed to fetch subscriber");
              continue
            }
            let not = new Notification({
              type: "important",
              title: "Allocation notification",
              body: `You are allocated at <b class="color-light-blue">${doc.entry.institutions[k].instName} 
              university</b> in <b class="color-light-blue">${doc.entry.progName}</b> program.
              You are required to attend to the allocated university/institution for further
              activities`,
              subscriber: subscriber._id,
              status: "unseen",
            });

            not = await not.save();
            if (!not) {
              console.log("Failed to create notification for ", doc.indexNo);
            }
          }
        }
      }
    }

    console.log("Allocation Complete");
  } catch (err) {
    console.log(err);
  }
};

const resetAllocation = async () => {
  const resInstAlloc = await Institution.updateMany(
    {},
    {
      "programs.$[].allocatedCandidates": 0,
    }
  );

  const resApp = await Application.updateMany(
    {},
    {
      allocated: false,
      $unset: { allocatedInst: "", allocatedProg: "" },
    }
  );

  if (!resApp) console.log("Failed to reset applications");
  if (!resInstAlloc) console.log("Failed to reset Institutions");
};

// resetAllocation();
// allocate();
