const mod = require("../db/model");

exports.hasProperties = (arg) => {
  if (Object.values(arg).length === 0) {
    throw new Error("Please pass in some options");
  }
};

exports.isValidEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

exports.unpackDoc = (doc) => {
  return {
    ...doc._doc,
    _id: doc.id,
  };
};

exports.levelDict = ["o", "c", "a", "d", "b", "m"];

exports.gradeDict = ["A", "B", "C", "D", "E", "S", "F"];

/* const test = new mod.Application(
  {indexNo: "S1895",
  applicant: "5ea6ec96f6a0d96df55ed73a",
  controlNumber: "iut",
  paymentStatus: "n",
  year: 2020,

  entry: [
    {
      program: "5ea6ec96f6a0d96df55ed73a",
      choice: 2,
      point: 5,
      institutions: [
        {
          inst: "5ea6ec96f6a0d96df55ed73a",
          priority: 2,
        },
      ],
    },
  ]},
);

const r = test.save().then(
  (err, doc)=>{
    console.log(doc)
  }
); */

const a = async () => {
  const applications = await mod.Application.aggregate([
    { $match: { "entry.choice": 4 } },
    { $unwind: "$entry" },

    {
      $group: {
        _id: {
          program: "$entry.program",
          // choice: "$entry.choice",
          // point: "$entry.point",
        },
        doc: { $addToSet: { indexNo: "$indexNo", entry: "$entry" } },
      },
    },

    { $sort: { "doc.entry.point": 1 } },

    { $project: { "doc.indexNo": 1, "doc.applicant": 1, "doc.entry": 1 } },
  ]);

  applications.forEach((a) => {
    console.log(a._id, a.doc[0].entry);
  });

  // console.log(applications);
};

// a();
