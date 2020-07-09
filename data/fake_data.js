"use strict";

const mongoose = require("mongoose");
const mod = require("../db/model");
const faker = require("faker");
const { unpackDoc } = require("../helpers/helper");
const { fake } = require("faker");

const fakeData = [];

for (let i = 1000; i < 7000; i++) {
  fakeData.push({
    indexNo: `S${i}`,
    applicant: mongoose.Types.ObjectId(),
    controlNumber: `${Date.now().toString()}${Math.floor(
      Math.random() * 978453
    )}`,
    paymentStatus: "p",
    level: "b",

    entry: [
      {
        program: mongoose.Types.ObjectId(),
        choice: Math.floor(Math.random() * 10),
        point: Math.floor(Math.random() * 20),
        institutions: [
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
        ],
      },

      {
        program: mongoose.Types.ObjectId(),
        choice: Math.floor(Math.random() * 10),
        point: Math.floor(Math.random() * 20),
        institutions: [
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
        ],
      },
      {
        program: mongoose.Types.ObjectId(),
        choice: Math.floor(Math.random() * 10),
        point: Math.floor(Math.random() * 20),
        institutions: [
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
        ],
      },
      {
        program: mongoose.Types.ObjectId(),
        choice: Math.floor(Math.random() * 10),
        point: Math.floor(Math.random() * 20),
        institutions: [
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
        ],
      },
      {
        program: mongoose.Types.ObjectId(),
        choice: Math.floor(Math.random() * 10),
        point: Math.floor(Math.random() * 20),
        institutions: [
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
        ],
      },
    ],
  });
}

const load = async (d) => {
  const m = [];

  d.forEach((e) => {
    m.push(new mod.Application(e));
  });

  return await mod.Application.collection.insertMany(m);
};

// load(fakeData);

const update = async () => {
  const id = [];
  for (let i = 1000; i <= 7000; i += 21) {
    id.push(`S${i}`);
  }

  // console.log(id);

  const result = await mod.Application.updateMany(
    { indexNo: { $in: id } },
    {
      $set: {
        "entry.1.program": "5eeb83a472bcab6045a15cb7",
        "entry.1.institutions.inst": "5eeb83a472bcab6045a15cb8",
      },
      //"entry.$.institutions.inst": "5eeb83a472bcab6045a15cb2",
    }
  );
  console.log(result);
};

const addProgs = async () => {
  const prs = [
    {
      name: "Bachelor of Science in Computer Science",
      level: "b",
    },

    {
      name: "Bachelor of Science in Computer Engineering",
      level: "b",
    },

    {
      name: "Bachelor of Arts",
      level: "b",
    },

    {
      name: "Bachelor of Business Administration",
      level: "b",
    },

    {
      name: "Bachelor of Science in Computer Science",
      level: "b",
    },

    {
      name: "Bachelor of Education",
      level: "b",
    },

    {
      name: "Bachelor of Mass Communication",
      level: "b",
    },

    {
      name: "Bachelor of Law",
      level: "b",
    },

    {
      name: "Bachelor of Music",
      level: "b",
    },

    {
      name: "Bachelor of Rocket Science",
      level: "b",
    },
  ];

  const progs = [];

  prs.forEach((pr) => {
    progs.push(pr);
  });

  await mod.Program.collection.insertMany(progs);
  return "OK";
};

const addInst = async () => {
  let progs = await mod.Program.find({}, { _id: 1 });

  const ins = [];
  for (let i = 0; i < 10; i++) {
    const programs = [];
    for (let j = 0; j < 10; j++) {
      programs.push({
        program: progs[j]._id,

        // Can choose the available standard criteria (i.e TCU) or create new one.
        criteria: "5f063031a794bd1197988968",

        // max accommodation of the students in this program
        maxCandidates: Math.floor(Math.random() * 100),
      });
    }
    ins.push({
      name: faker.name.title(),

      regNo: faker.date.past().toDateString(),
      website: faker.internet.url(),
      desc: faker.lorem.text(),
      programs: programs,
    });
  }

  /* const institutions = [];
  ins.forEach((i)=>{
    institutions.push(new mod.Institution(i))
  }); */

  const result = await mod.Institution.insertMany(ins);
  console.log(result);
};

const subDic = {
  P: "Physics",
  C: "Chemistry",
  M: "Mathematics",
  B: "Biology",
  G: "Geography",
};

const grades = ["A", "B", "C"];
const subs = ["P", "C", "G", "B", "M"];

const addSchoolResults = async () => {
  /* const schoolResults = [];
  for (let i = 0; i < 5; i++) {
    let subjects = [];

    for (let i = 0; i < 3; i++) {
      subjects.push({
        name:
          subDic[
            subs[
              Math.floor(
                (Math.random() * Object.keys(subDic).length) %
                  Object.keys(subDic).length
              )
            ]
          ],
        grade:
          grades[Math.floor((Math.random() * grades.length ) % grades.length)],
      });
    }

    schoolResults.push({
      indexNo: faker.phone.phoneNumber(),
      level: "a",
      enrolledYear: new Date(Date.now()).getFullYear(),
      center: "S1298",
      gradePoint: Math.floor(Math.random() * 15),
      program: "PCM", // combination: PCM, PCB, CBG, EGM ....
      subjects: subjects
    });
  };

  schoolResults.forEach(s=>{
    console.log(s.subjects)
  }) */

  // const result = await mod.SchoolResult.insertMany(schoolResults);
  // console.log(result);

  const schoolResult = new mod.SchoolResult({
    indexNo: "S1298.0245.2014",
    level: "a",
    enrolledYear: 2014,
    center: "S1298",
    gradePoint: 5,
    program: "PCB", // combination: PCM, PCB, CBG, EGM ....
    subjects: [
      {
        name: "Physics",
        grade: "B",
      },
      {
        name: "Chemistry",
        grade: "B",
      },
      {
        name: "Biology",
        grade: "B",
      },
    ],
  });

  const result = await schoolResult.save();
  console.log(result);
};

const addCriteria = async () => {
  const criteria = new mod.Criteria({
    school: {
      // a -> A-Level, o -> O-level.
      level: ["a"],
      gradPoint: 7,
      // PCM, PGM, PCB, CBG, EGM, ...
      programs: ["PCB", "PCM", "PGM"],
      mandatorySubs: [
        {
          name: "Physics",
          grade: "A",
        },

        {
          name: "Chemistry",
          grade: "A",
        },
      ],
      // c -> certificate, ...
      applicationLevel: "b",
    },
  });

  const result = await criteria.save();
  console.log(result);
};

const addApplicant = async () => {
  const applicants = [];

  for (let i = 0; i < 20; i++) {
    applicants.push({
      firstName: faker.name.firstName(),
      middleName: faker.name.lastName(),
      lastName: faker.name.lastName(),
      email: faker.phone.phoneNumber(),
      phoneNumber: faker.phone.phoneNumber(),

      gender: "M",

      // for tracking students results.
      indexNo: `S1298.02${i}.2014`,
    });
  }

  const results = await mod.Applicant.insertMany(applicants);
  console.log(results);
};


// addApplicant();

// addCriteria();

// Has some problem.
// addSchoolResults();

addInst();

// addProgs();

// update();

// load(fakeData);
